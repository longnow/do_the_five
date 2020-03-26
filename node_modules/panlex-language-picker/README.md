# PanLex Language Picker

Zero dependency Web Component that allows users to select a PanLex language variety

## Installation

npm install panlex-language-picker

Then add the following tag to your HTML:
`<script type="module" src="node_modules/panlex-language-picker/index.js"></script>`

That's it.

## Usage

The Javascript file defines a new customized `input` element:
`<input type="text" is="panlex-language-picker"></input>`

`type` should be set to `"text"`. `value` can be set if an initial value is needed.

When a language is selected by the user, the `data-lv` attribute is set to the PanLex Language Variety ID (e.g. "187" for English), the `data-uid` attribute is set to the PanLex Language Variety UID (e.g. "eng-000" for English), and a `language-select` event is fired, which can be listened for.

### Why is it so ugly?

It's styled as minimally as necessary to make it work, on the principle that implementers will style it themselves. This is also why it's not implemented with a shadow-dom, so external stylesheets will be able to take effect.

When the component is added to the DOM, it is wrapped in `<div class="panlex-language-picker"></div>` (so the dropdown menu will display properly). The easiest way to style it is to work from this class.

The attributes `list-class` and `list-item-class` can also be set to specify the class of the dropdown menu and its items, respectively.

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## History

1.0.0: Initial release
1.2.0: Added ability to set initial value
2.0.0: Switched to custom `<input>` component instead of entirely new componenent, added event firing

## License

MIT Licensed, see license file.
