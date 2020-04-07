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

`include` is an optional attribute for fetching additional data about the language variety. Each value should be separated by a space, e.g. `include="expr_count region_expr_langvar"`. See [here](https://dev.panlex.org/api/#suggest) (under `/suggest/langvar`) for valid values (invalid values are ignored). Some useful ones are `expr_count` for the number of expressions the language variety contains, `script_expr_txt` for the language variety's ISO 15924 script code, and `region_expr_txt` for the language variety's region code (typically as either an ISO-3166-1 alpha-2 code like "DE" or "US", or a UN M49 code like "419" for Latin America).

When a language is selected by the user, the `data-lv` attribute is set to the PanLex Language Variety ID (e.g. "187" for English), the `data-uid` attribute is set to the PanLex Language Variety UID (e.g. "eng-000" for English), and anything requested in `include` is set to `data-` + value (e.g. `data-expr_count`). Finally, a `language-select` event is fired, which can be listened for.

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
2.3.0: Added ability to `include` additional data.

## License

MIT Licensed, see license file.
