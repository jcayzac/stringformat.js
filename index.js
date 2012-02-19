(function(g) {
	var FORMAT_RE = /({+)([^:{\|}]+)(\|([^:}]+))?(:(-?\d*)([ij]?))?(}+)/g,
		defined = function(x) { return typeof x !== 'undefined' },
		format = function() {
			var args = arguments,
				str = this

			return this.replace(FORMAT_RE, function() {
				var m = arguments,
					match = m[0],
					braces_in = m[1],
					id = m[2],
					named = (id % 1 !== 0),
					property_chain = m[4] || (named && id),
					padding = m[6],
					modifier = m[7],
					braces_out = m[8],
					property,
					obj = {},
					arg = named ? args[0] : args[id],
					res = []
				if (braces_in.length > 1 && braces_out.length > 1)
					return match.slice(1, match.length - 1)
				
				property_chain = property_chain && property_chain.split('.') || []
				while (defined(property = property_chain.shift()) && defined(arg)) {
					obj = arg
					arg = arg[property]
				}
				if (typeof arg === 'function') arg = arg.call(obj, [])

				if ('i' === modifier) arg = Math.round(arg)
				if ('j' === modifier) arg = JSON.stringify(arg)
				if (!defined(arg)) return match

				arg = String(arg)
				if (padding < 0) {
					res.push(arg)
					padding = 1 - padding
				}
				if (padding > arg.length) res.length = padding - arg.length
				if (!defined(res[0])) res[res.length] = arg
				return res.join(" ")
			})
		},
		main = function() {
			return format.apply(arguments[0], Array.prototype.slice.call(arguments, 1))
		}
	main.extendString = function(methodName) {
		String.prototype[methodName || 'format'] = format
	}
	g.top ? g.stringformat = main : module.exports = main
})(this)

