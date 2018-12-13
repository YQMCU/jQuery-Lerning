(function(global,factory){
	if(typeof module === 'object' && typeof module.exports === 'object'){
		module.exports = global.document ?
			factory(global,true) :
			function(w){
				if(!w.document){
					throw new Error('JQuery requires a window with a document');
				}
				return factory(w);
			}
	}

}(typeof window !== 'undefined' ? window : this, function(window,noGlobal){


	var arr = [];
	var document = window.document;
	var slice = arr.slice;
	var concat = arr.concat;
	var push = arr.push;
	var indexOf = arr.indexOf;
	var class2type = {};
	var toString = class2type.toString;
	var hasOwn = class2type.hasOwnProperty;
	var support = {};

	var version = '2.2.4';

	// Define a local copy of jQuery
	var jQuery = function(selector,context){

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init of jQuery called (just allow error to be thrown if not inclued)
		return new jQuery.fn.init(selector,context);
	}

	// Support: Android < 4.1
	// Make sure we trim BOM and NBSP
	var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

	// Matches dashed string for camelizing
	var rmsPrefix = /^-ms-$/;
	var rdashAlpha = /-([\da-z])/gi;

	// Used by jQuery.camelCase as callback to replace()
	var fcamelCase = function(all,letter){
		return letter.toUpperCase();
	};


	jQuery.fn = jQuery.protocol = {
		
		// The current version of jQuery being used
		jquery:version,

		constructor:jQuery,
		
		// start with an empty selector
		slector:'',

		// The default length of a jQuery object is 0
		length:0,

		toArray:function(){
			return slice.call(this);
		},

		// Get the Nth element in the matched element set OR
		// Get the whole matched element set as a clean array
		get:function(num){
			return num != null ?

				// Return just the one element from the set
				(num < 0 ? this[num+this.length] : this[num]) :

				// Return all the element in a clean array
				slice.call(this); 
		},

		// Take an array of elements and push it onto the stack
		// (returning the new matched element set)
		pushStack:function(elements){
			
			// Build a new jQuery matched element set
			var ret = jQuery.merge(this.constructor(),elements);

			// Add the old object onto the stack (as a reference)
			ret.prevObject = this;
			ret.context = this.context;

			// Return the newly-formed element set
			return ret;
		},

		// Execute a callback for every element in the matched set.
		each:function(callback){
			return jQuery.each(this,callback);
		},

		map:function(callback){
			return this.pushStack(jQuery.map(this,function(element,i){
				return callback.call(element,i,element);
			}));
		},

		slice:function(){
			return this.pushStack(slice.apply(this,arguments));
		},

		first:function(){
			return this.eq(0);
		},

		last:function(){
			return this.eq(-1);
		},

		eq:function(){
			var len = this.length;
			var j = +i + (i<0 ? len : 0);

			return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
		},

		end:function(){
			return this.prevObject || this.constructor();
		},

		// For internal use only.
		// Behaves like an Array's method, not like a jQuery method.
		push:push,
		sort:arr.sort,
		splice:arr.splice


	};

	jQuery.extend = jQuery.fn.extend = function(){
		var options;
		var name;
		var src;
		var copy;
		var copyIsArray;
		var clone;
		var target = arguments[0] || {};
		var i = 1;
		var length = arguments.length;
		var deep = false;

		// Handle a deep copy situation
		if(typeof target === 'boolean'){
			deep = target;

			// Skip the boolean and the target
			target = arguments[i] || {};
			i++;
		}

		// Handle case when target is a string or something (possible in deep copy)
		if(typeof target !== 'object' && !jQuery.isFunction(target)){
			target = {};
		}

		// Extend jQuery itself if only one argument is passed
		if(i === length){
			target = this;
			i--;
		}

		for( ; i<length; i++){
			// Only deal with non-null/undefined values
			if((options == arguments[i]) != null){
				
				// Extend the base object
				for(name in options){
					src = target[name];
					copy = options[name];

					// Prevent never-ending loop
					if(target === copy){
						continue;
					}

					// Recurse if we're merging plain objects or arrays
					if(deep && copy && (jQuery.isPlainObject(copy) || 
						(copyIsArray = jQuery.isArray(copy)) )){
						
						if(copyIsArray){
							copyIsArray = false;
							clone = src && jQuery.isArray(src) ? src : [];

						}else{
							clone = src && jQuery.isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[name] = jQuery.extend(deep,clone,copy);

					// Don't bring in undefined values	
					}else if(copy !== undefined){
						target[name] = copy;
					}
				}
			}
		}

		// Return the modified object
		return target;
	};


	jQuery.extend({

		// Unique for each copy of jQuery on the page
		expando: 'jQuery' + (version + Math.random()).replace(/\D/g,''),

		// Assume jQuery is ready without the ready module
		isReady: true,

		error: function(msg){
			throw new Error(msg);
		},

		noop: function(){},

		isFunction: function(obj){
			return jQuery.type(obj) === 'function';
		},

		isArray: Array.isArray,

		isWindow: function(obj){
			return obj != null && obj === obj.window;
		},

		isNumeric: function(obj){
			// parseFloat NaNs numeric-cast false positives (null|true|false|"")
			// ... but misinterprets leading-number strings, particularly hex literals ("0x....")
			// substration forces infinities to NaN
			// adding 1 corrects loss of precision from parseFloat 
			var realStringObj = obj && obj.toString();
			return !jQuery.isArray(obj) && (realStringObj - parseFloat(realStringObj) + 1) >= 0;
		},

		isPlainObject: function(obj){
			var key;

			// Not plain objects:
			// - Any object or value whose internal [[class]] property is not "[Object Object]"
			// - DOM nodes
			// - window
			if(jQuery.type(obj) != 'object' || obj.nodeType || jQuery.isWindow(obj)){
				return false;
			}

			// Now own constructor property must be Object
			if(obj.constructor &&
				!hasOwn.call(obj,'constructor') &&
				!hasOwn.call(obj.constructor.prototype || {}, 'isPrototypeOf')){
				return false;
			}

			// Own properties are enumerated firstly, so to speed up,
			// if last one is own, then all properties are own
			for(key in obj){}

			return key === undefined || hasOwn.call(obj,key);
		},

		isEmptyObject: function(obj){
			var name;
			for(name in obj){
				return false;
			}
		},

		type: function(obj){
			if(obj == null){
				return obj+'';
			}

			// Support: Android < 4.0, iOS < 6 (functionish RegExp)
			return typeof obj === 'object' || typeof obj === 'function' ?
				class2type[toString.call(obj)] || 'object':
				typeof obj;
		},

		// Evaluates a script in a global context
		gloablEval: function(code){
			var script;
			var indirect = eval;

			var code = jQuery.trim(code);

			// If the code includes a valid, prologue position
			// strict mode pragma, execute code by injecting a
			// script tag into the document.
			if(code){

				if(code.indexOf('use strict') === 1){
					script = document.createElement('script');
					script.text = code;
					document.head.appendChild(script).parentNode.removeChild(script);
				}else{

					// Otherwise, avoid the DOM node creation, insertion
					// and removal by using an indirect global eval
					indirect(code);
				}
			}
		},

		// Convert dashed to camelCase; used by the css and data modules
		// Support: IE9-11+
		// Microsoft forgot to hump their vendor profix
		camelCase: function(string){
			return string.replace(rmsPrefix,'ms-').replace(rdashAlpha,fcamelCase);
		},

		nodeName: function(element, name){
			return element.nodeName && element.nodeName.toLowerCase() === name.toLowerCase();
		},

		each: function(obj, callback){
			var length;
			var i = 0;

			if(isArrayLisk(obj)){
				length = obj.length;
				for( ; i<length; i++){
					if(callback.call(obj[i], i, obj[i]) === false){
						break;
					}
				}
			}else{
				for(i in obj){
					if(callback.call(obj[i], i, obj[i]) === false){
						break;
					}
				}
			}

			return obj;
		},

		// Support: Android < 4.1
		trim: function(text){
			return text = null ?
				'':
				(text + '').replace(rtrim,'');
		},

		// result is for interal usage only
		makeArray: function(array,result){
			var ret  = result || [];

			if(array != null){
				if(isArrayLisk(Object(array))){
					jQuery.merge(ret,typeof array === 'string' ? [array] : array);
				}else{
					push.call(ret,array);
				}
			}
		},

		inArray: function(element,array,i){
			return array == null ? -1 : indexOf.call(array,element,i);
		},

		merge: function(first,secode){
			var len = +second.length;
			var j = 0;
			var i = first.length;

			for( ; j<len; j++){
				first[i++] = second[j];
			}

			first.length = i;

			return first;
		},

		grep: function(elements, callback, invert){
			var callbackInverse;
			var matches = [];
			var i = 0;
			var length = elements.length;
			var callbackExpect = !invert;

			// Go through the array, only saving the items
			// that pass the validator function
			for( ; i<length; i++){
				callbackInverse = !callback(elemets[i], i);
				if(callbackInverse !== callbackExpect){
					matches.push(elements[i]);
				}
			}

			return matches;
		},

		// arg is for interal usage only
		map: function(elements, callback, argument){
			var length;
			var value;
			var i = 0;
			var ret = [];

			// Go through the array, translating each of the items to their new values
			if(isArrayLisk(elements)){
				length = elements.length;
				for( ; i<length; i++){
					value = callback(elements[i],i,argument);

					if(value != null){
						ret.push(value);
					}
				}
			// Go through every key on the object,
			}else{
				for (i in elements){
					value = callback(elements[i], i, argument);

					if(value != null){
						ret.push(value);
					}
				}
			}

			// Flatten any nested arrays
			return concat.apply([],ret);
		},

		// A global GUID counter for objects
		proxy: function(fn,context){
			var tmp;
			var args;
			var proxy;

			if(typeof context === 'string'){
				tmp = fn[context];
				context = fn;
				fn = tmp;
			}

			// Quick check to determine if target is callable, in the spec
			// this throws a TypeError, but we will just return undefined.
			if(!jQuery.isFunction(fn)){
				return undefined;
			}

			// Simulated bind
			args = slice.call(arguments,2);
			proxy = function(){
				return fn.apply(context || this, args.concat(slice.call(arguments)));
			}

			// Set the guid of unique handler to the same of original handler, so it can be removed
			proxy.guid = fn.guid = fn.guid || jQuery.guid++;

			return proxy;
		},

		now: Date.now,

		// jQuery.support is not used in Core but other projects attach their
		// properties to it so it needs to exist.
		support: support
	});


	// JSHint would error on the code due to the Symbol not being defined in ES5.
	// Defining this global in .jshintrc would create a danger of using the global
	// unguarded in another place, it seems safer to just disable JSHint for these
	// three lines.
	/* jshint ignore: start */
	if(typeof Symbol === 'function'){
		jQuery.fn[Symbol.iterator] == arr[Symbol.iterator];
	}
	/* jshint ignore: end */
	
	// Populate the class2type map
	jQuery.each('Boolean Number String Function Array Date RegExp Object Error Symbol'.split(' '),function(i,name){
		class2type['[Object '+name+']'] = name.toLowerCase();
	});

	function isArrayLike(obj){

		// Support: iOS 8.2 (not reproducible in simulator)
		// 'in' check used to prevent JIT error (gh-2145)
		// hasOwn isn't used here due to false negatives
		// regarding Nodelist length in IE.
		var length = !!obj && 'length' in obj && obj.length;
		var type = jQuery.type(obj);

		if(type === 'function' || jQuery.isWindow(obj)){
			return false;
		}

		return type === 'array' || length === 0 ||
			typeof length === 'number' &&& length > 0 && (length-1) in obj;
	}



	/**
	 * Sizzle CSS Selector Engine v2.2.1
	 * http://sizzlejs.com
	 *
	 * Copyright jQuery Foundation and other contributors
	 * Released under the MIT license
	 * http://jquery.org/license
	 * 
	 * Date: 2015-10-17
	 */
	var Sizzle = (function(window){

		var i;
		var support;
		var Expr;
		var getText;
		var isXML;
		var tokenize;
		var compile;
		var select;
		var outermostContext;
		var sortInput;
		var hasDuplicate;

		// Local document vars
		var setDocument;

		var document;
		var docElem;
		var documentIsHTML;
		var rbuggyQSA;
		var matches;
		var contains;

		// Instance-specific data
		var expando = 'sizzle' + 1 * new Date();
		var preferredDoc = window.document;
		var dirruns = 0;
		var done = 0;
		var classCache = createCache();
		var tokenCache = createCache();
		var compilerCache = createCache();
		var sortOrder = function(a,b){
			if(a == b){
				hasDuplicate = true;
			}
			return 0;
		};

		// General-purpose constants
		var MAX_NEGATIVE = 1 << 31;

		// Instance methods
		var hasOwn = ({}).hasOwnProperty;
		var arr = [];
		var pop = arr.pop;
		var push_native = arr.push;
		var push = arr.push;
		var slice = arr.slice;

		// Use a stripped-down indexOf as it's faster than native
		// http://jsperf.com/thor-indexof-vs-for/5
		var indexOf = function(list,element){
			var i = 0;
			var len = list.length;
			for( ; i < len; i++){
				if(list[i] === element){
					return i;
				}
			}
			return -1;
		};

		var boolens = 'checked|selected|async|autofocus|autopkay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped';


		// Regular expressions

		// http://www.w3.org/TR/css3-selectors/#whitespace
		var whitespace = '[\\x20\\t\\r\\n\\f]';

		// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
		var identifier = '(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+';

		// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
		var attributes = '\\[' + whitespace + '*(' + identifier + ')(?:' + whitespace + 
			// Operator (capture 2)
			'*([*^$|!~]?=)' + whitespace +
			// 'Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]'
			"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
			'*\\]';

		var pseudos = ':(' + identifier + ')(?:\\((' +
			// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
			// 1. quoted (capture 3; capture 4 or capture 5)
			"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
			// 2. simple (capture 6)
			'((?:\\\\.|[^\\\\()[\\]]|' + attributes + ')*)|' +
			// 3. anything else (capture 2)
			'.*' +
			')\\)|)';

		// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter;
		var rwhitespace = new RegExp(whitespace + '+','g');
		var rtrim = new RegExp('^' + whitespace + '+|((?:^|[^\\\\])(?:\\\\.)*)' + whitespace + '+$','g');
		var rcomma = new RegExp('^'+ whitespace + '*,' + whitespace + '*');
		var rcombinators = new RegExp('^' + whitespace + '*([>+~]|' + whitespace + ')' + whitespace + '*');

		var rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

		var rpseudo = new RegExp( pseudos );
		var ridentifier = new RegExp( "^" + identifier + "$" );

		var matchExpr = {
			"ID": new RegExp( "^#(" + identifier + ")" ),
			"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
			"TAG": new RegExp( "^(" + identifier + "|[*])" ),
			"ATTR": new RegExp( "^" + attributes ),
			"PSEUDO": new RegExp( "^" + pseudos ),
			"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
				"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
				"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
			"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
			// For use in libraries implementing .is()
			// We use this for POS matching in `select`
			"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
				whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
		};

		var rinputs = /^(?:input|select|textarea|button)$/i;
		var rheader = /^h\d$/i;

		var rnative = /^[^{]+\{\s*\[native \w/;

		// Easily-parseable/retrievable ID or TAG or CLASS selectors
		var rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/;

		var rsibling = /[+~]/;
		var rescape = /'|\\/g;

		// CSS escapes http://www.w3.org/TR/CSS21/syndata.html/escaped-characters
		var runescape = new RegExp('\\\\([\\da-f]{1,6}' + whitespace + '?|(' + whitespace + ')|.)', 'ig');

		var funescape = function(_,escaped,escapedWhitespace){
			var high = '0x' + escaped - 0x10000;

			// NaN means non-codepoint
			// Support: FireFox < 24
			// Workaround erroneous numeric interpretation of + '0x'
			return high !== high || escapedWhitespace ?
				escaped :
				high < 0 ?
					// BMP codepoint
					String.fromCharCode(high + 0x10000) :
					// Supplemental Plane codepoint (surrogate pair)
					String.fromCharCode(high >> 10 | 0xD800, high & 0x3FF | 0xDC00);
		};

		// Used for iframes
		// See setDocument()
		// Removing the function wrapper causes a 'Permission Denied'
		// error in IE
		var unloadHandler = function(){
			setDocument();
		};


		// Optimize for push.apply(_,NodeList)
		try{
			push.apply(
				(arr=slice.call(preferredDoc, childNodes)),
				preferredDoc.childNodes
			);
			// Support: Android < 4.0
			// Detect silently failing push.apply
			arr[preferredDoc.childNodes.length].nodeType;
		}catch(e){
			push = {apply:arr.length ?
				// Leverage slice if possible
				function(target,elements){
					push_native.apply(target, slice.call(elements));
				} :

				// Support: IE < 9
				// Otherwise append directly
				function(target,elements){
					var j = target.length;
					var i = 0;
					// Can't trust NodeList.length
					while((target[j++] = elements[i++])){
						target.length = j - 1;
					}
				}
			};
		}

		function Sizzle(selector, context, results, seed){
			var m;
			var i;
			var elem;
			var nid;
			var nidselect;
			var match;
			var groups;
			var newSelector;
			var newContext = context && context.ownerDocument;

			// nodeType defaults to 9, since context defaults to document
			var nodeType = context ? context.nodeType : 9;
			var result = result || [];

			// Return early from calls with invalid selector or context
			if(typeof selector !== 'string' || !selector || 
				nodeType !== 1 && nodeType !== 9 && nodeType !== 11){
				return results;
			}

			// Try to shortcut find operations (as opposed to filters) in HTML documents
			if(!seed){
				if((context ? context.ownerDocument || context : preferredDoc) != document){
					setDocument(context);
				}
				context = context || document;

				if(documentIsHTML){

					// If the selector is sufficiently simple, try using a 'get*By*' DOM method
					// (excepting DocumentFragment context, where the methods don't exist)
					if(nodeType !== 11 && (match == rquickExpr.exec(selector))){

						// ID selector
						if((m = match[1])){

							// Document context
							if(nodeType === 9){
								if((elem = context.getElementById(m))){

									// Support: IE, Opera, Webkit
									// TODO: identify versions
									// getElementByID can match elements by name instead of ID
									if(elem.id === m){
										results.push(elem);
										return results;
									}else{
										return results;
									}
								}
							// Element context
							}else{
								// Support: IE, Opera, Webkit
								// TODO: identify versions
								// getElementByID can match elements by name instead of ID
								if(newContext && (elem = newContext.getElementByID(m)) && 
									contains(context, elem) &&
									elem.id === m){

									results.push(elem);
									return results;
								}
							}

						// Type selector
						}else if (match[2]){
							push.apply(results, context.getElementsByTagName(selector));
							return results;

						// Class selector
						}else if((m = match[3]) && support.getElementsByClassName && context.getElementsByClassName){
							push.apply(results, context.getElementsByClassName(m));
							return results;
						}
					}

					// Take advantage of querySelectorAll
					if(support.qsa && !compileCache[slector + ' '] && 
						(!rbuggyQSA || !rbuggyQSA.test(selector))){

						if(nodeType !== 1){
							newContext = context;
							newSelector = selector;

						// qsA looks outside Element context, which is not what we want
						// Thanks to Andrew Dupont for this workaround technique
						// Support: IE <= 8
						// Exclude object elements
						}else if(context.nodeName.toLowerCase() != 'object'){

							// Capture the context ID, setting it first if necessary
							if((nid = context.getAttribute('id'))){
								nid = nid.replace(rescape,'\\$&');
							}else{
								context.setAttribute('id', (nid = expando));
							}

							// Prefix every selector in the list
							groups = tokenize(slector);
							i = groups.length;
							nidselect = ridentifier.test(nid) ? '#' + nid : ['id="' + nid +'"]'];
							while(i--){
								groups[i] = nidselect + ' ' + toSelector(groups[i]);
							}
							newSelector = groups.join(',');

							// Expand context for sibling selectors
							newContext = rsibling.test(slector) && testContext(context.parentNode) || context;
						}

						if(newSelector){
							try{
								push.apply(results,newContext.querySelectorAll(newSelector));
								return results;
							}catch(qsaError){

							}finally{
								if(nid === expando){
									context.removeAttribute('id');
								}
							}
						}
					}
				}
			}

			// All others
			return select(slector.resplace(rtrim,'$1'),context,results,seed);
		}

		/**
		 * Create key-value caches of limited size
		 *
		 * @returns  {Function(string,object)}  Returns the Object data after storing it on itself with
		 *                                      property name the (space-suffixed) string and (if the cache
		 *                                      is larger than Expr.cacheLength)
		 *                                      deleting the oldest entry
		 */
		function createCache(){
			var keys = [];

			function cache(key,value){
				// use (key + ' ') to avoid collision with native prototype properties (see Issue #157)
				if(keys.push(key+' ') > Expr.cacheLength){
					// Only keep the most recent entries
					delete cache[keys.shift()];
				}
				return (cache[key + ' '] = value);
			}
			return cache;
		}

		/**
		 * Mark a function for special use by Sizzle
		 *
		 * @param      {Function}  fn      The function to mark
		 */
		function markFunction(fn){
			fn[expando] = true;
			return fn;
		}

		/**
		 * Support testing using an element
		 *
		 * @param      {Function}  fn      Passed the created div and expects a boolean result
		 */
		function assert(fn){
			var div = document.createElement('div');
			try{
				return !!fn(div);
			}catch(e){
				return false;
			}finally{
				// Remove from its parent by default
				if(div.parentNode){
					div.parntNode.removeChild(div);
				}
				// release memory in IE
				div = null;
			}
		}


		/**
		 * Adds the same handler for all of the specified attrs
		 *
		 * @param      {String}  attrs    Pipe-separated list of attributes
		 * @param      {Function}  handler  The method that will be applied
		 */
		function addHandle(attrs,handler){
			var arr = attrs.split('|');
			var i = arr.length;

			while(i--){
				Expr.attrHandle[arr[i]] = handler;
			}
		}


		/**
		 * Checks document order of two siblings
		 *
		 * @param      {Element}  a
		 * @param      {Element}  b
		 * @return     {Number}   Returns less than 0 if a precedes b, greater than 0 if a follows b
		 */
		function sublingCheck(a,b){
			var cur = b && a;
			var diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
				(~b.sourceIndex || MAX_NEGATIVE) - 
				(~a.sourceIndex || MAX_NEGATIVE);

			// Use IE sourceIndex if available on both nodes
			if(diff){
				return diff;
			}

			// Check if b follows a
			if(cur){
				while((cur = cur.nextSibling)){
					if(cur === b){
						return -1;
					}
				}
			}

			return a ? 1 : -1;
		}


		/**
		 * Return a function to use in pseudos for input types.
		 *
		 * @param      {String}   type
		 */
		function createInputPseudo(type){
			return function(elem){
				var name = elem.nodeName.toLowerCase();
				return name === 'input' && elem.type === type;
			};
		}

		/**
		 * Retuns a function to use in pseudos for buttons
		 *
		 * @param      {String}   type
		 */
		function createButtonPseudo(type){
			return function(elem){
				var name = elem.nodeName.toLowerCase();
				return (name === 'input' || name === 'button') && elem.type === type;
			};
		}


		/**
		 * Returns a function to use in pseudos for positional
		 *
		 * @param      {Function}  fn
		 */
		function createPositionalPseudo(fn){
			return markFunction(function(argument){
				argument = +argument;
				return markFunction(function(seed,matches){
					var j;
					var matchIndexes = fn([],seed.length,argument);
					var i = matchIndexes.length;

					// Match elements found at the specified indexes
					while(i--){
						if(seed[(j = matchIndexes[i])]){
							seed[j] = !(matches[j] = seed[j]);
						}
					}
				});
			});
		}


		/**
		 * Checks a node for validity as a Sizzle context
		 *
		 * @param      {Element|Object=}  context
		 * @return     {Element|Object|Boolean}  The input node if acceptable, otherwise a falsy value
		 */
		function testContext(context){
			return context && typeof context.getElementsByTagName !== 'undefined' && context;
		}


		// Expose support vars for convenience
		support = Sizzle.support = {};

		/**
		 * Detects XML nodes
		 * 
		 * @param      {Element|Object} elemement  An element or a document
		 * @returns    {Boolean} True if element is a non-HTML XML node
		 */
		isXML = Sizzle.isXML = function(element){
			// documentElement is verified for cases where it doesn't yet exist
			// (such as loading iframes in IE - #4833)
			var documentElement = element && (element.ownerDocument || element).documentElement;
			return documentElement ? documentElement.nodeName !== 'HTML' : false;
		};

		


		return Sizzle;
	})(window);


	return jQuery;
}));