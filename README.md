# Wild Magic Surge Automator

## Description

The Wild Magic Surge Automator is a Foundry VTT module that automates the process of checking for and resolving Wild Magic Surges in D&D 5e games. This module is currently in its initial development phase (Version 0.1), offering core functionality with plans for future enhancements.

## Features

- Automatic Wild Magic Surge checks when selected actors cast spells
- Configurable Wild Magic Surge DC
- Multiple roll table selection for diverse Wild Magic effects
- Flexible actor selection to apply Wild Magic Surges to specific characters
- Search functionality for easy filtering of roll tables and actors
- Customizable through an easy-to-use configuration interface

## Installation

1. In Foundry VTT, navigate to the "Add-on Modules" tab in the Configuration and Setup menu.
2. Click the "Install Module" button and enter the following URL in the "Manifest URL" field:
   https://raw.githubusercontent.com/HonkLord/wildmagic/main/module.json
3. Click "Install" to add the module to your Foundry VTT setup.

## Configuration

1. After installing and enabling the module, go to the Game Settings menu.
2. Click on "Module Settings" and find "Wild Magic Surge Automator" in the list.
3. Click the "Configure" button to open the configuration menu.
4. In the configuration menu:
   - Set the Wild Magic Surge DC (default is 1)
   - Select one or more roll tables to use for Wild Magic effects
   - Choose the actors to apply Wild Magic Surges to
   - Use the search boxes to filter tables and actors for easier selection
5. Click "Save Changes" to apply your configuration.

## Usage

Once configured, the module will automatically:

1. Check for Wild Magic Surges when selected actors cast spells of 1st level or higher.
2. Roll against the configured DC to determine if a surge occurs.
3. If a surge occurs, randomly select one of the chosen roll tables and draw an effect.
4. Display the result in the chat, showing the spell caster, the roll result, and the Wild Magic effect.

## Customization

- **Roll Tables**: Create your own Wild Magic Surge tables in Foundry VTT and select them in the module configuration for unique effects.
- **Actors**: You can change which actors are subject to Wild Magic Surges at any time through the configuration menu.
- **DC**: Adjust the Wild Magic Surge DC to increase or decrease the frequency of surges.

## Compatibility

- Tested with Foundry VTT version 10 and above (verified up to version 12.331)
- Requires the D&D 5e system for Foundry VTT.
- Dependencies: lib-wrapper, midi-qol

## Known Issues

As this is an initial release (Version 0.1), you may encounter some bugs or incomplete features. We appreciate your patience and feedback as we continue to improve the module.

## Planned Features

- Integration with character sheets to automatically detect Wild Magic Sorcerers
- Additional customization options for surge triggers
- Performance optimizations for larger games

## Support

This module is currently in active development. If you encounter any issues or have suggestions for improvements, please file an issue on the [GitHub repository](https://github.com/HonkLord/wildmagic). Your feedback is crucial in helping us improve the module.

## License

[Specify your license here, e.g., MIT, GNU GPL, etc.]

## Credits

Developed by HonkLord

## Changelog

### Version 0.1 (Current)

- Initial beta release
- Implemented core Wild Magic Surge automation
- Added configuration menu for DC, roll tables, and actor selection
- Included search functionality for roll tables and actors
