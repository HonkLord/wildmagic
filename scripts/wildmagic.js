// wildmagic.js

class WildMagicSurge {
  static init() {
    game.settings.register("wildmagic", "selectedTable", {
      name: "Selected Wild Magic Table",
      hint: "The roll table to use for Wild Magic Surges",
      type: String,
      default: "",
      config: false,
    });

    game.settings.register("wildmagic", "selectedActors", {
      name: "Selected Actors",
      hint: "Actors that Wild Magic Surge applies to",
      type: Array,
      default: [],
      config: false,
    });

    game.settings.register("wildmagic", "wildMagicDC", {
      name: "Wild Magic Surge DC",
      hint: "The DC for triggering a Wild Magic Surge (default: 1)",
      type: Number,
      default: 1,
      config: false,
    });

    game.settings.registerMenu("wildmagic", "wildMagicConfig", {
      name: "Wild Magic Configuration",
      label: "Configure",
      hint: "Configure Wild Magic Surge settings",
      icon: "fas fa-cog",
      type: WildMagicConfig,
      restricted: true,
    });
  }

  static registerHooks() {
    Hooks.on("midi-qol.RollComplete", WildMagicSurge.onRollComplete);
  }

  static async onRollComplete(workflow) {
    try {
      console.log("Wild Magic Surge: Roll Complete triggered", workflow);
      if (!workflow?.item?.type || workflow.item.type !== "spell") return;
      if (!workflow?.item?.system?.level || workflow.item.system.level < 1)
        return;

      const actor = workflow.actor;
      if (!actor) return;

      if (WildMagicSurge.isWildMagicApplicable(actor)) {
        await WildMagicSurge.checkWildMagicSurge(actor);
      }
    } catch (error) {
      console.error("Wild Magic Surge Error:", error);
    }
  }

  static isWildMagicApplicable(actor) {
    const selectedActors =
      game.settings.get("wildmagic", "selectedActors") || [];
    return selectedActors.includes(actor.id);
  }

  static async checkWildMagicSurge(actor) {
    const wildMagicDC = game.settings.get("wildmagic", "wildMagicDC") || 1;

    // Create a Roll instance and evaluate it asynchronously
    const roll = new Roll("1d20");
    const rollResult = await roll.evaluate(); // No async option needed, this is asynchronous by default

    // Show the roll result in the chat
    await roll.toMessage({
      flavor: `${actor.name} - Wild Magic Surge Check`,
      speaker: ChatMessage.getSpeaker({ actor: actor }),
    });

    console.log(`Wild Magic Surge: D20 roll result: ${rollResult.total}`);

    if (rollResult.total <= wildMagicDC) {
      const tableId = game.settings.get("wildmagic", "selectedTable");
      if (!tableId) {
        ui.notifications.error("No Wild Magic Surge table selected.");
        return;
      }

      const surgeTable = game.tables.get(tableId);

      if (surgeTable) {
        const tableRoll = await surgeTable.draw({ displayChat: false });
        const surgeEffect = tableRoll.results[0]?.text || "No effect";

        console.log(`Wild Magic Surge: Table roll result: ${surgeEffect}`);

        await ChatMessage.create({
          content: `<p><strong>${actor.name}</strong> triggers a Wild Magic Surge!</p>
                  <p>Roll Result: ${rollResult.total}</p>
                  <p><strong>Wild Magic Effect (${surgeTable.name}):</strong> ${surgeEffect}</p>`,
          speaker: ChatMessage.getSpeaker({ actor: actor }),
        });
      } else {
        ui.notifications.error(`Wild Magic Surge table not found.`);
      }
    }
  }
}

class WildMagicConfig extends FormApplication {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      title: "Wild Magic Surge Configuration",
      id: "wildmagic-config",
      template: "modules/wildmagic/templates/config.html",
      width: 400,
      height: "auto",
    });
  }

  getData() {
    const selectedActors =
      game.settings.get("wildmagic", "selectedActors") || [];
    const actorMap = new Map(game.actors.contents.map((a) => [a.id, a.name]));

    const data = {
      wildMagicDC: game.settings.get("wildmagic", "wildMagicDC"),
      selectedTable: game.settings.get("wildmagic", "selectedTable"),
      selectedActors: selectedActors.map((id) => ({
        id,
        name: actorMap.get(id) || "Unknown Actor",
      })),
      tables: game.tables.contents.map((t) => ({ id: t.id, name: t.name })),
      actors: game.actors.contents.map((a) => ({ id: a.id, name: a.name })),
    };
    console.log("getData returning:", data);
    return data;
  }

  async _updateObject(event, formData) {
    console.log("Form submitted:", formData);
    await game.settings.set("wildmagic", "wildMagicDC", formData.wildMagicDC);
    await game.settings.set(
      "wildmagic",
      "selectedTable",
      formData.selectedTable
    );
    // selectedActors is now handled via add/remove methods
  }

  activateListeners(html) {
    super.activateListeners(html);
    html.find("#actorSelect").on("change", this._onActorSelect.bind(this));
    html.find(".remove-actor").on("click", this._onRemoveActor.bind(this));
  }

  async _onActorSelect(event) {
    const actorId = event.target.value;
    const actor = game.actors.get(actorId);
    if (actor) {
      const selectedActors =
        game.settings.get("wildmagic", "selectedActors") || [];
      if (!selectedActors.includes(actorId)) {
        selectedActors.push(actorId);
        await game.settings.set("wildmagic", "selectedActors", selectedActors);
        this.render();
      }
    }
  }

  async _onRemoveActor(event) {
    const actorId = event.currentTarget.dataset.id;
    const selectedActors =
      game.settings.get("wildmagic", "selectedActors") || [];
    const updatedActors = selectedActors.filter((id) => id !== actorId);
    await game.settings.set("wildmagic", "selectedActors", updatedActors);
    this.render();
  }
}

Hooks.once("init", () => {
  console.log("Wild Magic Surge module initializing");

  WildMagicSurge.init();

  game.settings.register("wildmagic", "wildMagicDC", {
    name: "Wild Magic Surge DC",
    hint: "The DC for triggering a Wild Magic Surge",
    type: Number,
    default: 1,
    config: false,
  });

  game.settings.register("wildmagic", "selectedTable", {
    name: "Selected Wild Magic Table",
    hint: "The roll table to use for Wild Magic Surges",
    type: String,
    default: "",
    config: false,
  });

  game.settings.registerMenu("wildmagic", "wildMagicConfig", {
    name: "Wild Magic Configuration",
    label: "Configure",
    hint: "Configure Wild Magic Surge settings",
    icon: "fas fa-cog",
    type: WildMagicConfig,
    restricted: true,
  });

  Handlebars.registerHelper("json", function (context) {
    return JSON.stringify(context, null, 2);
  });

  console.log("Wild Magic Surge module loaded");
});

Hooks.once("ready", () => {
  WildMagicSurge.registerHooks();
});
