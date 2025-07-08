/*!
 * FullCalendar v2.2.5
 * Docs & License: http://arshaw.com/fullcalendar/
 * (c) 2013 Adam Shaw
 */

(function(factory) {
	if (typeof define === 'function' && define.amd) {
		define([ 'jquery', 'moment' ], factory);
	}
	else {
		factory(jQuery, moment);
	}
})(function($, moment) {

    var defaults = {

	titleRangeSeparator: ' \u2014 ', // emphasized dash
	monthYearFormat: 'MMMM YYYY', // required for en. other languages rely on datepicker computable option

	defaultTimedEventDuration: '02:00:00',
	defaultAllDayEventDuration: { days: 1 },
	forceEventDuration: false,
	nextDayThreshold: '09:00:00', // 9am

	// display
	defaultView: 'month',
	aspectRatio: 1.35,
	header: {
		left: 'title',
		center: '',
		right: 'today prev,next'
	},
	weekends: true,
	weekNumbers: false,

	weekNumberTitle: 'W',
	weekNumberCalculation: 'local',
	
	//editable: false,
	
	// event ajax
	lazyFetching: true,
	startParam: 'start',
	endParam: 'end',
	timezoneParam: 'timezone',

	timezone: false,

	//allDayDefault: undefined,

	// locale
	isRTL: false,
	defaultButtonText: {
		prev: "prev",
		next: "next",
		prevYear: "prev year",
		nextYear: "next year",
		today: 'today',
		month: 'month',
		week: 'week',
		day: 'day'
	},

	buttonIcons: {
		prev: 'left-single-arrow',
		next: 'right-single-arrow',
		prevYear: 'left-double-arrow',
		nextYear: 'right-double-arrow'
	},
	
	// jquery-ui theming
	theme: false,
	themeButtonIcons: {
		prev: 'circle-triangle-w',
		next: 'circle-triangle-e',
		prevYear: 'seek-prev',
		nextYear: 'seek-next'
	},

	dragOpacity: .75,
	dragRevertDuration: 500,
	dragScroll: true,
	
	//selectable: false,
	unselectAuto: true,
	
	dropAccept: '*',

	eventLimit: false,
	eventLimitText: 'more',
	eventLimitClick: 'popover',
	dayPopoverFormat: 'LL',
	
	handleWindowResize: true,
	windowResizeDelay: 200 // milliseconds before an updateSize happens
	
};


var englishDefaults = {
	dayPopoverFormat: 'dddd, MMMM D'
};


// right-to-left defaults
var rtlDefaults = {
	header: {
		left: 'next,prev today',
		center: '',
		right: 'title'
	},
	buttonIcons: {
		prev: 'right-single-arrow',
		next: 'left-single-arrow',
		prevYear: 'right-double-arrow',
		nextYear: 'left-double-arrow'
	},
	themeButtonIcons: {
		prev: 'circle-triangle-e',
		next: 'circle-triangle-w',
		nextYear: 'seek-prev',
		prevYear: 'seek-next'
	}
};

    var fc = $.fullCalendar = { version: "2.2.5" };
var fcViews = fc.views = {};


$.fn.fullCalendar = function(options) {
	var args = Array.prototype.slice.call(arguments, 1); // for a possible method call
	var res = this; // what this function will return (this jQuery object by default)

	this.each(function(i, _element) { // loop each DOM element involved
		var element = $(_element);
		var calendar = element.data('fullCalendar'); // get the existing calendar object (if any)
		var singleRes; // the returned value of this single method call

		// a method call
		if (typeof options === 'string') {
			if (calendar && $.isFunction(calendar[options])) {
				singleRes = calendar[options].apply(calendar, args);
				if (!i) {
					res = singleRes; // record the first method call result
				}
				if (options === 'destroy') { // for the destroy method, must remove Calendar object data
					element.removeData('fullCalendar');
				}
			}
		}
		// a new calendar initialization
		else if (!calendar) { // don't initialize twice
			calendar = new Calendar(element, options);
			element.data('fullCalendar', calendar);
			calendar.render();
		}
	});
	
	return res;
};


// function for adding/overriding defaults
function setDefaults(d) {
	mergeOptions(defaults, d);
}


// Recursively combines option hash-objects.
// Better than `$.extend(true, ...)` because arrays are not traversed/copied.
//
// called like:
//     mergeOptions(target, obj1, obj2, ...)
//
function mergeOptions(target) {

	function mergeIntoTarget(name, value) {
		if ($.isPlainObject(value) && $.isPlainObject(target[name]) && !isForcedAtomicOption(name)) {
			// merge into a new object to avoid destruction
			target[name] = mergeOptions({}, target[name], value); // combine. `value` object takes precedence
		}
		else if (value !== undefined) { // only use values that are set and not undefined
			target[name] = value;
		}
	}

	for (var i=1; i<arguments.length; i++) {
		$.each(arguments[i], mergeIntoTarget);
	}

	return target;
}


// overcome sucky view-option-hash and option-merging behavior messing with options it shouldn't
function isForcedAtomicOption(name) {
	// Any option that ends in "Time" or "Duration" is probably a Duration,
	// and these will commonly be specified as plain objects, which we don't want to mess up.
	return /(Time|Duration)$/.test(name);
}
// FIX: find a different solution for view-option-hashes and have a whitelist
// for options that can be recursively merged.

    var langOptionHash = fc.langs = {}; // initialize and expose


// TODO: document the structure and ordering of a FullCalendar lang file
// TODO: rename everything "lang" to "locale", like what the moment project did


// Initialize jQuery UI datepicker translations while using some of the translations
// Will set this as the default language for datepicker.
fc.datepickerLang = function(langCode, dpLangCode, dpOptions) {

	// get the FullCalendar internal option hash for this language. create if necessary
	var fcOptions = langOptionHash[langCode] || (langOptionHash[langCode] = {});

	// transfer some simple options from datepicker to fc
	fcOptions.isRTL = dpOptions.isRTL;
	fcOptions.weekNumberTitle = dpOptions.weekHeader;

	// compute some more complex options from datepicker
	$.each(dpComputableOptions, function(name, func) {
		fcOptions[name] = func(dpOptions);
	});

	// is jQuery UI Datepicker is on the page?
	if ($.datepicker) {

		// Register the language data.
		// FullCalendar and MomentJS use language codes like "pt-br" but Datepicker
		// does it like "pt-BR" or if it doesn't have the language, maybe just "pt".
		// Make an alias so the language can be referenced either way.
		$.datepicker.regional[dpLangCode] =
			$.datepicker.regional[langCode] = // alias
				dpOptions;

		// Alias 'en' to the default language data. Do this every time.
		$.datepicker.regional.en = $.datepicker.regional[''];

		// Set as Datepicker's global defaults.
		$.datepicker.setDefaults(dpOptions);
	}
};


// Sets FullCalendar-specific translations. Will set the language as the global default.
fc.lang = function(langCode, newFcOptions) {
	var fcOptions;
	var momOptions;

	// get the FullCalendar internal option hash for this language. create if necessary
	fcOptions = langOptionHash[langCode] || (langOptionHash[langCode] = {});

	// provided new options for this language? merge them in
	if (newFcOptions) {
		mergeOptions(fcOptions, newFcOptions);
	}

	// compute language options that weren't defined.
	// always do this. newFcOptions can be undefined when initializing from i18n file,
	// so no way to tell if this is an initialization or a default-setting.
	momOptions = getMomentLocaleData(langCode); // will fall back to en
	$.each(momComputableOptions, function(name, func) {
		if (fcOptions[name] === undefined) {
			fcOptions[name] = func(momOptions, fcOptions);
		}
	});

	// set it as the default language for FullCalendar
	defaults.lang = langCode;
};


// NOTE: can't guarantee any of these computations will run because not every language has datepicker
// configs, so make sure there are English fallbacks for these in the defaults file.
var dpComputableOptions = {

	defaultButtonText: function(dpOptions) {
		return {
			// the translations sometimes wrongly contain HTML entities
			prev: stripHtmlEntities(dpOptions.prevText),
			next: stripHtmlEntities(dpOptions.nextText),
			today: stripHtmlEntities(dpOptions.currentText)
		};
	},

	// Produces format strings like "MMMM YYYY" -> "September 2014"
	monthYearFormat: function(dpOptions) {
		return dpOptions.showMonthAfterYear ?
			'YYYY[' + dpOptions.yearSuffix + '] MMMM' :
			'MMMM YYYY[' + dpOptions.yearSuffix + ']';
	}

};

var momComputableOptions = {

	// Produces format strings like "ddd MM/DD" -> "Fri 12/10"
	dayOfMonthFormat: function(momOptions, fcOptions) {
		var format = momOptione:
#0 C:\Users\Abdul Basir Momand\Desktop\baba_company\vendor\laravel\framework\src\Illuminate\Database\DatabaseManager.php(509): Illuminate\Database\Connection->__call('first', Array)
#1 C:\Users\Abdul Basir Momand\Desktop\baba_company\vendor\laravel\framework\src\Illuminate\Support\Facades\Facade.php(355): Illuminate\Database\DatabaseManager->__call('first', Array)
#2 Command line code(1): Illuminate\Support\Facades\Facade::__callStatic('first', Array)
#3 {main}
  thrown {"exception":"[object] (Symfony\\Component\\ErrorHandler\\Error\\FatalError(code: 0): Uncaught BadMethodCallException: Method Illuminate\\Database\\MySqlConnection::first does not exist. in C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Macroable\\Traits\\Macroable.php:112
Stack trace:
#0 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\DatabaseManager.php(509): Illuminate\\Database\\Connection->__call('first', Array)
#1 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Support\\Facades\\Facade.php(355): Illuminate\\Database\\DatabaseManager->__call('first', Array)
#2 Command line code(1): Illuminate\\Support\\Facades\\Facade::__callStatic('first', Array)
#3 {main}
  thrown at C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Macroable\\Traits\\Macroable.php:112)
[stacktrace]
#0 {main}
"} 
[2024-03-23 07:35:39] local.ERROR: Uncaught BadMethodCallException: Method Illuminate\Database\MySqlConnection::first does not exist. in C:\Users\Abdul Basir Momand\Desktop\baba_company\vendor\laravel\framework\src\Illuminate\Macroable\Traits\Macroable.php:112
Stack trace:
#0 C:\Users\Abdul Basir Momand\Desktop\baba_company\vendor\laravel\framework\src\Illuminate\Database\DatabaseManager.php(509): Illuminate\Database\Connection->__call('first', Array)
#1 C:\Users\Abdul Basir Momand\Desktop\baba_company\vendor\laravel\framework\src\Illuminate\Support\Facades\Facade.php(355): Illuminate\Database\DatabaseManager->__call('first', Array)
#2 Command line code(1): Illuminate\Support\Facades\Facade::__callStatic('first', Array)
#3 {main}
  thrown {"exception":"[object] (Symfony\\Component\\ErrorHandler\\Error\\FatalError(code: 0): Uncaught BadMethodCallException: Method Illuminate\\Database\\MySqlConnection::first does not exist. in C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Macroable\\Traits\\Macroable.php:112
Stack trace:
#0 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\DatabaseManager.php(509): Illuminate\\Database\\Connection->__call('first', Array)
#1 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Support\\Facades\\Facade.php(355): Illuminate\\Database\\DatabaseManager->__call('first', Array)
#2 Command line code(1): Illuminate\\Support\\Facades\\Facade::__callStatic('first', Array)
#3 {main}
  thrown at C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Macroable\\Traits\\Macroable.php:112)
[stacktrace]
#0 {main}
"} 
[2024-03-23 07:41:57] local.ERROR: Uncaught BadMethodCallException: Method Illuminate\Database\MySqlConnection::first does not exist. in C:\Users\Abdul Basir Momand\Desktop\baba_company\vendor\laravel\framework\src\Illuminate\Macroable\Traits\Macroable.php:112
Stack trace:
#0 C:\Users\Abdul Basir Momand\Desktop\baba_company\vendor\laravel\framework\src\Illuminate\Database\DatabaseManager.php(509): Illuminate\Database\Connection->__call('first', Array)
#1 C:\Users\Abdul Basir Momand\Desktop\baba_company\vendor\laravel\framework\src\Illuminate\Support\Facades\Facade.php(355): Illuminate\Database\DatabaseManager->__call('first', Array)
#2 Command line code(1): Illuminate\Support\Facades\Facade::__callStatic('first', Array)
#3 {main}
  thrown {"exception":"[object] (Symfony\\Component\\ErrorHandler\\Error\\FatalError(code: 0): Uncaught BadMethodCallException: Method Illuminate\\Database\\MySqlConnection::first does not exist. in C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Macroable\\Traits\\Macroable.php:112
Stack trace:
#0 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\DatabaseManager.php(509): Illuminate\\Database\\Connection->__call('first', Array)
#1 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Support\\Facades\\Facade.php(355): Illuminate\\Database\\DatabaseManager->__call('first', Array)
#2 Command line code(1): Illuminate\\Support\\Facades\\Facade::__callStatic('first', Array)
#3 {main}
  thrown at C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Macroable\\Traits\\Macroable.php:112)
[stacktrace]
#0 {main}
"} 
[2024-03-23 07:42:00] local.ERROR: Uncaught BadMethodCallException: Method Illuminate\Database\MySqlConnection::first does not exist. in C:\Users\Abdul Basir Momand\Desktop\baba_company\vendor\laravel\framework\src\Illuminate\Macroable\Traits\Macroable.php:112
Stack trace:
#0 C:\Users\Abdul Basir Momand\Desktop\baba_company\vendor\laravel\framework\src\Illuminate\Database\DatabaseManager.php(509): Illuminate\Database\Connection->__call('first', Array)
#1 C:\Users\Abdul Basir Momand\Desktop\baba_company\vendor\laravel\framework\src\Illuminate\Support\Facades\Facade.php(355): Illuminate\Database\DatabaseManager->__call('first', Array)
#2 Command line code(1): Illuminate\Support\Facades\Facade::__callStatic('first', Array)
#3 {main}
  thrown {"exception":"[object] (Symfony\\Component\\ErrorHandler\\Error\\FatalError(code: 0): Uncaught BadMethodCallException: Method Illuminate\\Database\\MySqlConnection::first does not exist. in C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Macroable\\Traits\\Macroable.php:112
Stack trace:
#0 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\DatabaseManager.php(509): Illuminate\\Database\\Connection->__call('first', Array)
#1 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Support\\Facades\\Facade.php(355): Illuminate\\Database\\DatabaseManager->__call('first', Array)
#2 Command line code(1): Illuminate\\Support\\Facades\\Facade::__callStatic('first', Array)
#3 {main}
  thrown at C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Macroable\\Traits\\Macroable.php:112)
[stacktrace]
#0 {main}
"} 
[2024-03-23 07:43:10] local.ERROR: Uncaught BadMethodCallException: Method Illuminate\Database\MySqlConnection::first does not exist. in C:\Users\Abdul Basir Momand\Desktop\baba_company\vendor\laravel\framework\src\Illuminate\Macroable\Traits\Macroable.php:112
Stack trace:
#0 C:\Users\Abdul Basir Momand\Desktop\baba_company\vendor\laravel\framework\src\Illuminate\Database\DatabaseManager.php(509): Illuminate\Database\Connection->__call('first', Array)
#1 C:\Users\Abdul Basir Momand\Desktop\baba_company\vendor\laravel\framework\src\Illuminate\Support\Facades\Facade.php(355): Illuminate\Database\DatabaseManager->__call('first', Array)
#2 Command line code(1): Illuminate\Support\Facades\Facade::__callStatic('first', Array)
#3 {main}
  thrown {"exception":"[object] (Symfony\\Component\\ErrorHandler\\Error\\FatalError(code: 0): Uncaught BadMethodCallException: Method Illuminate\\Database\\MySqlConnection::first does not exist. in C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Macroable\\Traits\\Macroable.php:112
Stack trace:
#0 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\DatabaseManager.php(509): Illuminate\\Database\\Connection->__call('first', Array)
#1 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Support\\Facades\\Facade.php(355): Illuminate\\Database\\DatabaseManager->__call('first', Array)
#2 Command line code(1): Illuminate\\Support\\Facades\\Facade::__callStatic('first', Array)
#3 {main}
  thrown at C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Macroable\\Traits\\Macroable.php:112)
[stacktrace]
#0 {main}
"} 
[2024-03-23 07:55:12] local.ERROR: Undefined property: stdClass::$direction_no {"view":{"view":"C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\resources\\views\\admin\\owner\\print_sponser.blade.php","data":{"errors":"<pre class=sf-dump id=sf-dump-1396227175 data-indent-pad=\"  \"><span class=sf-dump-note>Illuminate\\Support\\ViewErrorBag</span> {<a class=sf-dump-ref>#1313</a><samp data-depth=1 class=sf-dump-expanded>
  #<span class=sf-dump-protected title=\"Protected property\">bags</span>: []
</samp>}
</pre><script>Sfdump(\"sf-dump-1396227175\", {\"maxDepth\":3,\"maxStringLength\":160})</script>
","select_owners":"<pre class=sf-dump id=sf-dump-2011908185 data-indent-pad=\"  \"><span class=sf-dump-note>Illuminate\\Support\\Collection</span> {<a class=sf-dump-ref>#1336</a><samp data-depth=1 class=sf-dump-expanded>
  #<span class=sf-dump-protected title=\"Protected property\">items</span>: <span class=sf-dump-note>array:1</span> [<samp data-depth=2 class=sf-dump-compact>
    <span class=sf-dump-index>0</span> => {<a class=sf-dump-ref>#1338</a><samp data-depth=3 class=sf-dump-compact>
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">id</span>\": <span class=sf-dump-num>3</span>
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">name</span>\": \"<span class=sf-dump-str title=\"6 characters\">&#1605;&#1740;&#1585;&#1608;&#1740;&#1587;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">last_name</span>\": \"<span class=sf-dump-str title=\"5 characters\">&#1605;&#1608;&#1605;&#1606;&#1583;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">Engine_no</span>\": \"<span class=sf-dump-str title=\"6 characters\">123034</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">from_add</span>\": \"<span class=sf-dump-str title=\"9 characters\">&#1670;&#1608;&#1705; &#1578;&#1604;&#1575;&#1588;&#1741;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">to_add</span>\": \"<span class=sf-dump-str title=\"8 characters\">&#1705;&#1575;&#1576;&#1604; &#1607;&#1673;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">direction_number</span>\": <span class=sf-dump-num>100</span>
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">shase_no</span>\": \"<span class=sf-dump-str title=\"5 characters\">30103</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">plate_no</span>\": \"<span class=sf-dump-str title=\"3 characters\">100</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">father_name</span>\": \"<span class=sf-dump-str title=\"9 characters\">&#1593;&#1589;&#1605;&#1578; &#1575;&#1604;&#1604;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">permenant_village</span>\": \"<span class=sf-dump-str title=\"6 characters\">&#1588;&#1576;&#1583;&#1740;&#1575;&#1606;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">current_village</span>\": \"<span class=sf-dump-str title=\"9 characters\">&#1662;&#1575;&#1587; &#1662;&#1594;&#1605;&#1575;&#1606;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">owner_job</span>\": \"<span class=sf-dump-str title=\"5 characters\">&#1673;&#1575;&#1705;&#1660;&#1585;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">nic_number</span>\": \"<span class=sf-dump-str title=\"4 characters\">1400</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">phone_number</span>\": \"<span class=sf-dump-str title=\"10 characters\">0775294943</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">image</span>\": \"<span class=sf-dump-str title=\"24 characters\">masy6h78ng9hpkwrcplq.jpg</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">per_provine_name</span>\": \"<span class=sf-dump-str title=\"7 characters\">&#1606;&#1606;&#1707;&#1585;&#1607;&#1575;&#1585;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">current_pro_name</span>\": \"<span class=sf-dump-str title=\"4 characters\">&#1705;&#1575;&#1576;&#1604;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">per_dist_name</span>\": \"<span class=sf-dump-str title=\"7 characters\">&#1576;&#1660;&#1610; &#1705;&#1608;&#1660;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">current_dist_name</span>\": \"<span class=sf-dump-str title=\"5 characters\">&#1662;&#1594;&#1605;&#1575;&#1606;</span>\"
    </samp>}
  </samp>]
  #<span class=sf-dump-protected title=\"Protected property\">escapeWhenCastingToString</span>: <span class=sf-dump-const>false</span>
</samp>}
</pre><script>Sfdump(\"sf-dump-2011908185\", {\"maxDepth\":3,\"maxStringLength\":160})</script>
","get_sponsers":"<pre class=sf-dump id=sf-dump-1776281199 data-indent-pad=\"  \"><span class=sf-dump-note>Illuminate\\Support\\Collection</span> {<a class=sf-dump-ref>#1335</a><samp data-depth=1 class=sf-dump-expanded>
  #<span class=sf-dump-protected title=\"Protected property\">items</span>: <span class=sf-dump-note>array:1</span> [<samp data-depth=2 class=sf-dump-compact>
    <span class=sf-dump-index>0</span> => {<a class=sf-dump-ref>#1342</a><samp data-depth=3 class=sf-dump-compact>
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">owner_code</span>\": <span class=sf-dump-num>3</span>
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">name</span>\": \"<span class=sf-dump-str title=\"6 characters\">&#1605;&#1740;&#1585;&#1608;&#1740;&#1587;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">last_name</span>\": \"<span class=sf-dump-str title=\"5 characters\">&#1605;&#1608;&#1605;&#1606;&#1583;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">father_name</span>\": \"<span class=sf-dump-str title=\"9 characters\">&#1593;&#1589;&#1605;&#1578; &#1575;&#1604;&#1604;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">grand_fname</span>\": \"<span class=sf-dump-str title=\"7 characters\">&#1575;&#1581;&#1605;&#1583;&#1588;&#1575;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">sponser_name</span>\": \"<span class=sf-dump-str title=\"9 characters\">&#1593;&#1589;&#1605;&#1578; &#1575;&#1604;&#1604;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">sponsor_fname</span>\": \"<span class=sf-dump-str title=\"7 characters\">&#1575;&#1581;&#1605;&#1583;&#1588;&#1575;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">per_village</span>\": \"<span class=sf-dump-str title=\"14 characters\">&#1602;&#1604;&#1593;&#1607; &#1580;&#1575;&#1606;&#1575;&#1606; &#1582;&#1575;&#1606;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">cur_village</span>\": \"<span class=sf-dump-str title=\"4 characters\">&#1602;&#1585;&#1594;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">phone_number</span>\": \"<span class=sf-dump-str title=\"11 characters\">07759543534</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">approval_barharli</span>\": \"\"\"
        <span class=sf-dump-str title=\"43 characters\">&#1606;&#1608;&#1605;&#1608;&#1683;&#1610; &#1588;&#1582;&#1589; &#1576;&#1585;&#1581;&#1575;&#1604;&#1610; &#1578;&#1575;&#1740;&#1740;&#1583; &#1583;&#1607;. <span class=\"sf-dump-default sf-dump-ns\">\\r\\n</span></span>
        <span class=sf-dump-str title=\"43 characters\">&#1608;&#1586;&#1575;&#1585;&#1578; &#1605;&#1582;&#1575;&#1576;&#1585;&#1575;&#1578;</span>
        \"\"\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">sponsor_image</span>\": \"<span class=sf-dump-str title=\"24 characters\">ilwdmgyhsozfdbfonpjz.jpg</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">per_provine_name</span>\": \"<span class=sf-dump-str title=\"7 characters\">&#1606;&#1606;&#1707;&#1585;&#1607;&#1575;&#1585;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">current_pro_name</span>\": \"<span class=sf-dump-str title=\"4 characters\">&#1705;&#1575;&#1576;&#1604;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">per_dist_name</span>\": \"<span class=sf-dump-str title=\"4 characters\">&#1705;&#1575;&#1605;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">current_dist_name</span>\": \"<span class=sf-dump-str title=\"5 characters\">&#1662;&#1594;&#1605;&#1575;&#1606;</span>\"
    </samp>}
  </samp>]
  #<span class=sf-dump-protected title=\"Protected property\">escapeWhenCastingToString</span>: <span class=sf-dump-const>false</span>
</samp>}
</pre><script>Sfdump(\"sf-dump-1776281199\", {\"maxDepth\":3,\"maxStringLength\":160})</script>
"}},"userId":4,"exception":"[object] (Spatie\\LaravelIgnition\\Exceptions\\ViewException(code: 0): Undefined property: stdClass::$direction_no at C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\resources\\views\\admin\\owner\\print_sponser.blade.php:53)
[stacktrace]
#0 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Bootstrap\\HandleExceptions.php(255): Illuminate\\Foundation\\Bootstrap\\HandleExceptions->handleError(2, 'Undefined prope...', 'C:\\\\Users\\\\Abdul ...', 53)
#1 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\resources\\views\\admin\\owner\\print_sponser.blade.php(53): Illuminate\\Foundation\\Bootstrap\\HandleExceptions->Illuminate\\Foundation\\Bootstrap\\{closure}(2, 'Undefined prope...', 'C:\\\\Users\\\\Abdul ...', 53)
#2 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Filesystem\\Filesystem.php(124): require('C:\\\\Users\\\\Abdul ...')
#3 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Filesystem\\Filesystem.php(125): Illuminate\\Filesystem\\Filesystem::Illuminate\\Filesystem\\{closure}()
#4 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\Engines\\PhpEngine.php(58): Illuminate\\Filesystem\\Filesystem->getRequire('C:\\\\Users\\\\Abdul ...', Array)
#5 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\Engines\\CompilerEngine.php(72): Illuminate\\View\\Engines\\PhpEngine->evaluatePath('C:\\\\Users\\\\Abdul ...', Array)
#6 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(207): Illuminate\\View\\Engines\\CompilerEngine->get('C:\\\\Users\\\\Abdul ...', Array)
#7 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(190): Illuminate\\View\\View->getContents()
#8 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(159): Illuminate\\View\\View->renderContents()
#9 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Response.php(69): Illuminate\\View\\View->render()
#10 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Response.php(35): Illuminate\\Http\\Response->setContent(Object(Illuminate\\View\\View))
#11 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(918): Illuminate\\Http\\Response->__construct(Object(Illuminate\\View\\View), 200, Array)
#12 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(885): Illuminate\\Routing\\Router::toResponse(Object(Illuminate\\Http\\Request), Object(Illuminate\\View\\View))
#13 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(805): Illuminate\\Routing\\Router->prepareResponse(Object(Illuminate\\Http\\Request), Object(Illuminate\\View\\View))
#14 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(144): Illuminate\\Routing\\Router->Illuminate\\Routing\\{closure}(Object(Illuminate\\Http\\Request))
#15 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Middleware\\SubstituteBindings.php(50): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#16 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Routing\\Middleware\\SubstituteBindings->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#17 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\VerifyCsrfToken.php(78): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#18 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\VerifyCsrfToken->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#19 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\Middleware\\ShareErrorsFromSession.php(49): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#20 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\View\\Middleware\\ShareErrorsFromSession->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#21 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Middleware\\StartSession.php(121): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#22 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Middleware\\StartSession.php(64): Illuminate\\Session\\Middleware\\StartSession->handleStatefulRequest(Object(Illuminate\\Http\\Request), Object(Illuminate\\Session\\Store), Object(Closure))
#23 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Session\\Middleware\\StartSession->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#24 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Cookie\\Middleware\\AddQueuedCookiesToResponse.php(37): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#25 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Cookie\\Middleware\\AddQueuedCookiesToResponse->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#26 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Cookie\\Middleware\\EncryptCookies.php(67): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#27 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Cookie\\Middleware\\EncryptCookies->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#28 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(119): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#29 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(805): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))
#30 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(784): Illuminate\\Routing\\Router->runRouteWithinStack(Object(Illuminate\\Routing\\Route), Object(Illuminate\\Http\\Request))
#31 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(748): Illuminate\\Routing\\Router->runRoute(Object(Illuminate\\Http\\Request), Object(Illuminate\\Routing\\Route))
#32 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(737): Illuminate\\Routing\\Router->dispatchToRoute(Object(Illuminate\\Http\\Request))
#33 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(200): Illuminate\\Routing\\Router->dispatch(Object(Illuminate\\Http\\Request))
#34 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(144): Illuminate\\Foundation\\Http\\Kernel->Illuminate\\Foundation\\Http\\{closure}(Object(Illuminate\\Http\\Request))
#35 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest.php(21): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#36 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\ConvertEmptyStringsToNull.php(31): Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#37 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\ConvertEmptyStringsToNull->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#38 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest.php(21): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#39 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TrimStrings.php(40): Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#40 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\TrimStrings->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#41 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\ValidatePostSize.php(27): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#42 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\ValidatePostSize->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#43 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\PreventRequestsDuringMaintenance.php(99): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#44 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\PreventRequestsDuringMaintenance->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#45 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Middleware\\HandleCors.php(49): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#46 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Http\\Middleware\\HandleCors->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#47 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Middleware\\TrustProxies.php(39): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#48 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Http\\Middleware\\TrustProxies->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#49 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(119): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#50 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(175): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))
#51 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(144): Illuminate\\Foundation\\Http\\Kernel->sendRequestThroughRouter(Object(Illuminate\\Http\\Request))
#52 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\public\\index.php(51): Illuminate\\Foundation\\Http\\Kernel->handle(Object(Illuminate\\Http\\Request))
#53 {main}

[previous exception] [object] (ErrorException(code: 0): Undefined property: stdClass::$direction_no at C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\storage\\framework\\views\\f1863c58f54826ce8fd79442db39d1b5.php:53)
[stacktrace]
#0 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Bootstrap\\HandleExceptions.php(255): Illuminate\\Foundation\\Bootstrap\\HandleExceptions->handleError(2, 'Undefined prope...', 'C:\\\\Users\\\\Abdul ...', 53)
#1 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\storage\\framework\\views\\f1863c58f54826ce8fd79442db39d1b5.php(53): Illuminate\\Foundation\\Bootstrap\\HandleExceptions->Illuminate\\Foundation\\Bootstrap\\{closure}(2, 'Undefined prope...', 'C:\\\\Users\\\\Abdul ...', 53)
#2 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Filesystem\\Filesystem.php(124): require('C:\\\\Users\\\\Abdul ...')
#3 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Filesystem\\Filesystem.php(125): Illuminate\\Filesystem\\Filesystem::Illuminate\\Filesystem\\{closure}()
#4 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\Engines\\PhpEngine.php(58): Illuminate\\Filesystem\\Filesystem->getRequire('C:\\\\Users\\\\Abdul ...', Array)
#5 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\Engines\\CompilerEngine.php(72): Illuminate\\View\\Engines\\PhpEngine->evaluatePath('C:\\\\Users\\\\Abdul ...', Array)
#6 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(207): Illuminate\\View\\Engines\\CompilerEngine->get('C:\\\\Users\\\\Abdul ...', Array)
#7 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(190): Illuminate\\View\\View->getContents()
#8 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(159): Illuminate\\View\\View->renderContents()
#9 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Response.php(69): Illuminate\\View\\View->render()
#10 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Response.php(35): Illuminate\\Http\\Response->setContent(Object(Illuminate\\View\\View))
#11 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(918): Illuminate\\Http\\Response->__construct(Object(Illuminate\\View\\View), 200, Array)
#12 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(885): Illuminate\\Routing\\Router::toResponse(Object(Illuminate\\Http\\Request), Object(Illuminate\\View\\View))
#13 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(805): Illuminate\\Routing\\Router->prepareResponse(Object(Illuminate\\Http\\Request), Object(Illuminate\\View\\View))
#14 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(144): Illuminate\\Routing\\Router->Illuminate\\Routing\\{closure}(Object(Illuminate\\Http\\Request))
#15 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Middleware\\SubstituteBindings.php(50): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#16 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Routing\\Middleware\\SubstituteBindings->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#17 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\VerifyCsrfToken.php(78): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#18 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\VerifyCsrfToken->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#19 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\Middleware\\ShareErrorsFromSession.php(49): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#20 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\View\\Middleware\\ShareErrorsFromSession->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#21 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Middleware\\StartSession.php(121): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#22 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Middleware\\StartSession.php(64): Illuminate\\Session\\Middleware\\StartSession->handleStatefulRequest(Object(Illuminate\\Http\\Request), Object(Illuminate\\Session\\Store), Object(Closure))
#23 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Session\\Middleware\\StartSession->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#24 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Cookie\\Middleware\\AddQueuedCookiesToResponse.php(37): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#25 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Cookie\\Middleware\\AddQueuedCookiesToResponse->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#26 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Cookie\\Middleware\\EncryptCookies.php(67): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#27 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Cookie\\Middleware\\EncryptCookies->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#28 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(119): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#29 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(805): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))
#30 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(784): Illuminate\\Routing\\Router->runRouteWithinStack(Object(Illuminate\\Routing\\Route), Object(Illuminate\\Http\\Request))
#31 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(748): Illuminate\\Routing\\Router->runRoute(Object(Illuminate\\Http\\Request), Object(Illuminate\\Routing\\Route))
#32 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(737): Illuminate\\Routing\\Router->dispatchToRoute(Object(Illuminate\\Http\\Request))
#33 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(200): Illuminate\\Routing\\Router->dispatch(Object(Illuminate\\Http\\Request))
#34 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(144): Illuminate\\Foundation\\Http\\Kernel->Illuminate\\Foundation\\Http\\{closure}(Object(Illuminate\\Http\\Request))
#35 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest.php(21): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#36 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\ConvertEmptyStringsToNull.php(31): Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#37 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\ConvertEmptyStringsToNull->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#38 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest.php(21): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#39 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TrimStrings.php(40): Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#40 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\TrimStrings->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#41 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\ValidatePostSize.php(27): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#42 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\ValidatePostSize->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#43 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\PreventRequestsDuringMaintenance.php(99): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#44 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\PreventRequestsDuringMaintenance->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#45 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Middleware\\HandleCors.php(49): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#46 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Http\\Middleware\\HandleCors->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#47 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Middleware\\TrustProxies.php(39): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#48 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Http\\Middleware\\TrustProxies->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#49 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(119): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#50 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(175): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))
#51 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(144): Illuminate\\Foundation\\Http\\Kernel->sendRequestThroughRouter(Object(Illuminate\\Http\\Request))
#52 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\public\\index.php(51): Illuminate\\Foundation\\Http\\Kernel->handle(Object(Illuminate\\Http\\Request))
#53 {main}
"} 
[2024-03-23 07:55:46] local.ERROR: Undefined property: stdClass::$direction_nubmer {"view":{"view":"C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\resources\\views\\admin\\owner\\print_sponser.blade.php","data":{"errors":"<pre class=sf-dump id=sf-dump-869774681 data-indent-pad=\"  \"><span class=sf-dump-note>Illuminate\\Support\\ViewErrorBag</span> {<a class=sf-dump-ref>#1313</a><samp data-depth=1 class=sf-dump-expanded>
  #<span class=sf-dump-protected title=\"Protected property\">bags</span>: []
</samp>}
</pre><script>Sfdump(\"sf-dump-869774681\", {\"maxDepth\":3,\"maxStringLength\":160})</script>
","select_owners":"<pre class=sf-dump id=sf-dump-2145011403 data-indent-pad=\"  \"><span class=sf-dump-note>Illuminate\\Support\\Collection</span> {<a class=sf-dump-ref>#1336</a><samp data-depth=1 class=sf-dump-expanded>
  #<span class=sf-dump-protected title=\"Protected property\">items</span>: <span class=sf-dump-note>array:1</span> [<samp data-depth=2 class=sf-dump-compact>
    <span class=sf-dump-index>0</span> => {<a class=sf-dump-ref>#1338</a><samp data-depth=3 class=sf-dump-compact>
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">id</span>\": <span class=sf-dump-num>3</span>
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">name</span>\": \"<span class=sf-dump-str title=\"6 characters\">&#1605;&#1740;&#1585;&#1608;&#1740;&#1587;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">last_name</span>\": \"<span class=sf-dump-str title=\"5 characters\">&#1605;&#1608;&#1605;&#1606;&#1583;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">Engine_no</span>\": \"<span class=sf-dump-str title=\"6 characters\">123034</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">from_add</span>\": \"<span class=sf-dump-str title=\"9 characters\">&#1670;&#1608;&#1705; &#1578;&#1604;&#1575;&#1588;&#1741;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">to_add</span>\": \"<span class=sf-dump-str title=\"8 characters\">&#1705;&#1575;&#1576;&#1604; &#1607;&#1673;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">direction_number</span>\": <span class=sf-dump-num>100</span>
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">shase_no</span>\": \"<span class=sf-dump-str title=\"5 characters\">30103</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">plate_no</span>\": \"<span class=sf-dump-str title=\"3 characters\">100</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">father_name</span>\": \"<span class=sf-dump-str title=\"9 characters\">&#1593;&#1589;&#1605;&#1578; &#1575;&#1604;&#1604;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">permenant_village</span>\": \"<span class=sf-dump-str title=\"6 characters\">&#1588;&#1576;&#1583;&#1740;&#1575;&#1606;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">current_village</span>\": \"<span class=sf-dump-str title=\"9 characters\">&#1662;&#1575;&#1587; &#1662;&#1594;&#1605;&#1575;&#1606;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">owner_job</span>\": \"<span class=sf-dump-str title=\"5 characters\">&#1673;&#1575;&#1705;&#1660;&#1585;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">nic_number</span>\": \"<span class=sf-dump-str title=\"4 characters\">1400</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">phone_number</span>\": \"<span class=sf-dump-str title=\"10 characters\">0775294943</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">image</span>\": \"<span class=sf-dump-str title=\"24 characters\">masy6h78ng9hpkwrcplq.jpg</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">per_provine_name</span>\": \"<span class=sf-dump-str title=\"7 characters\">&#1606;&#1606;&#1707;&#1585;&#1607;&#1575;&#1585;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">current_pro_name</span>\": \"<span class=sf-dump-str title=\"4 characters\">&#1705;&#1575;&#1576;&#1604;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">per_dist_name</span>\": \"<span class=sf-dump-str title=\"7 characters\">&#1576;&#1660;&#1610; &#1705;&#1608;&#1660;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">current_dist_name</span>\": \"<span class=sf-dump-str title=\"5 characters\">&#1662;&#1594;&#1605;&#1575;&#1606;</span>\"
    </samp>}
  </samp>]
  #<span class=sf-dump-protected title=\"Protected property\">escapeWhenCastingToString</span>: <span class=sf-dump-const>false</span>
</samp>}
</pre><script>Sfdump(\"sf-dump-2145011403\", {\"maxDepth\":3,\"maxStringLength\":160})</script>
","get_sponsers":"<pre class=sf-dump id=sf-dump-1956568223 data-indent-pad=\"  \"><span class=sf-dump-note>Illuminate\\Support\\Collection</span> {<a class=sf-dump-ref>#1335</a><samp data-depth=1 class=sf-dump-expanded>
  #<span class=sf-dump-protected title=\"Protected property\">items</span>: <span class=sf-dump-note>array:1</span> [<samp data-depth=2 class=sf-dump-compact>
    <span class=sf-dump-index>0</span> => {<a class=sf-dump-ref>#1342</a><samp data-depth=3 class=sf-dump-compact>
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">owner_code</span>\": <span class=sf-dump-num>3</span>
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">name</span>\": \"<span class=sf-dump-str title=\"6 characters\">&#1605;&#1740;&#1585;&#1608;&#1740;&#1587;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">last_name</span>\": \"<span class=sf-dump-str title=\"5 characters\">&#1605;&#1608;&#1605;&#1606;&#1583;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">father_name</span>\": \"<span class=sf-dump-str title=\"9 characters\">&#1593;&#1589;&#1605;&#1578; &#1575;&#1604;&#1604;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">grand_fname</span>\": \"<span class=sf-dump-str title=\"7 characters\">&#1575;&#1581;&#1605;&#1583;&#1588;&#1575;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">sponser_name</span>\": \"<span class=sf-dump-str title=\"9 characters\">&#1593;&#1589;&#1605;&#1578; &#1575;&#1604;&#1604;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">sponsor_fname</span>\": \"<span class=sf-dump-str title=\"7 characters\">&#1575;&#1581;&#1605;&#1583;&#1588;&#1575;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">per_village</span>\": \"<span class=sf-dump-str title=\"14 characters\">&#1602;&#1604;&#1593;&#1607; &#1580;&#1575;&#1606;&#1575;&#1606; &#1582;&#1575;&#1606;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">cur_village</span>\": \"<span class=sf-dump-str title=\"4 characters\">&#1602;&#1585;&#1594;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">phone_number</span>\": \"<span class=sf-dump-str title=\"11 characters\">07759543534</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">approval_barharli</span>\": \"\"\"
        <span class=sf-dump-str title=\"43 characters\">&#1606;&#1608;&#1605;&#1608;&#1683;&#1610; &#1588;&#1582;&#1589; &#1576;&#1585;&#1581;&#1575;&#1604;&#1610; &#1578;&#1575;&#1740;&#1740;&#1583; &#1583;&#1607;. <span class=\"sf-dump-default sf-dump-ns\">\\r\\n</span></span>
        <span class=sf-dump-str title=\"43 characters\">&#1608;&#1586;&#1575;&#1585;&#1578; &#1605;&#1582;&#1575;&#1576;&#1585;&#1575;&#1578;</span>
        \"\"\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">sponsor_image</span>\": \"<span class=sf-dump-str title=\"24 characters\">ilwdmgyhsozfdbfonpjz.jpg</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">per_provine_name</span>\": \"<span class=sf-dump-str title=\"7 characters\">&#1606;&#1606;&#1707;&#1585;&#1607;&#1575;&#1585;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">current_pro_name</span>\": \"<span class=sf-dump-str title=\"4 characters\">&#1705;&#1575;&#1576;&#1604;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">per_dist_name</span>\": \"<span class=sf-dump-str title=\"4 characters\">&#1705;&#1575;&#1605;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">current_dist_name</span>\": \"<span class=sf-dump-str title=\"5 characters\">&#1662;&#1594;&#1605;&#1575;&#1606;</span>\"
    </samp>}
  </samp>]
  #<span class=sf-dump-protected title=\"Protected property\">escapeWhenCastingToString</span>: <span class=sf-dump-const>false</span>
</samp>}
</pre><script>Sfdump(\"sf-dump-1956568223\", {\"maxDepth\":3,\"maxStringLength\":160})</script>
"}},"userId":4,"exception":"[object] (Spatie\\LaravelIgnition\\Exceptions\\ViewException(code: 0): Undefined property: stdClass::$direction_nubmer at C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\resources\\views\\admin\\owner\\print_sponser.blade.php:53)
[stacktrace]
#0 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Bootstrap\\HandleExceptions.php(255): Illuminate\\Foundation\\Bootstrap\\HandleExceptions->handleError(2, 'Undefined prope...', 'C:\\\\Users\\\\Abdul ...', 53)
#1 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\resources\\views\\admin\\owner\\print_sponser.blade.php(53): Illuminate\\Foundation\\Bootstrap\\HandleExceptions->Illuminate\\Foundation\\Bootstrap\\{closure}(2, 'Undefined prope...', 'C:\\\\Users\\\\Abdul ...', 53)
#2 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Filesystem\\Filesystem.php(124): require('C:\\\\Users\\\\Abdul ...')
#3 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Filesystem\\Filesystem.php(125): Illuminate\\Filesystem\\Filesystem::Illuminate\\Filesystem\\{closure}()
#4 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\Engines\\PhpEngine.php(58): Illuminate\\Filesystem\\Filesystem->getRequire('C:\\\\Users\\\\Abdul ...', Array)
#5 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\Engines\\CompilerEngine.php(72): Illuminate\\View\\Engines\\PhpEngine->evaluatePath('C:\\\\Users\\\\Abdul ...', Array)
#6 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(207): Illuminate\\View\\Engines\\CompilerEngine->get('C:\\\\Users\\\\Abdul ...', Array)
#7 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(190): Illuminate\\View\\View->getContents()
#8 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(159): Illuminate\\View\\View->renderContents()
#9 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Response.php(69): Illuminate\\View\\View->render()
#10 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Response.php(35): Illuminate\\Http\\Response->setContent(Object(Illuminate\\View\\View))
#11 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(918): Illuminate\\Http\\Response->__construct(Object(Illuminate\\View\\View), 200, Array)
#12 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(885): Illuminate\\Routing\\Router::toResponse(Object(Illuminate\\Http\\Request), Object(Illuminate\\View\\View))
#13 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(805): Illuminate\\Routing\\Router->prepareResponse(Object(Illuminate\\Http\\Request), Object(Illuminate\\View\\View))
#14 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(144): Illuminate\\Routing\\Router->Illuminate\\Routing\\{closure}(Object(Illuminate\\Http\\Request))
#15 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Middleware\\SubstituteBindings.php(50): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#16 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Routing\\Middleware\\SubstituteBindings->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#17 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\VerifyCsrfToken.php(78): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#18 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\VerifyCsrfToken->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#19 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\Middleware\\ShareErrorsFromSession.php(49): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#20 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\View\\Middleware\\ShareErrorsFromSession->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#21 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Middleware\\StartSession.php(121): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#22 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Middleware\\StartSession.php(64): Illuminate\\Session\\Middleware\\StartSession->handleStatefulRequest(Object(Illuminate\\Http\\Request), Object(Illuminate\\Session\\Store), Object(Closure))
#23 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Session\\Middleware\\StartSession->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#24 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Cookie\\Middleware\\AddQueuedCookiesToResponse.php(37): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#25 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Cookie\\Middleware\\AddQueuedCookiesToResponse->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#26 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Cookie\\Middleware\\EncryptCookies.php(67): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#27 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Cookie\\Middleware\\EncryptCookies->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#28 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(119): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#29 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(805): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))
#30 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(784): Illuminate\\Routing\\Router->runRouteWithinStack(Object(Illuminate\\Routing\\Route), Object(Illuminate\\Http\\Request))
#31 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(748): Illuminate\\Routing\\Router->runRoute(Object(Illuminate\\Http\\Request), Object(Illuminate\\Routing\\Route))
#32 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(737): Illuminate\\Routing\\Router->dispatchToRoute(Object(Illuminate\\Http\\Request))
#33 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(200): Illuminate\\Routing\\Router->dispatch(Object(Illuminate\\Http\\Request))
#34 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(144): Illuminate\\Foundation\\Http\\Kernel->Illuminate\\Foundation\\Http\\{closure}(Object(Illuminate\\Http\\Request))
#35 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest.php(21): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#36 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\ConvertEmptyStringsToNull.php(31): Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#37 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\ConvertEmptyStringsToNull->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#38 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest.php(21): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#39 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TrimStrings.php(40): Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#40 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\TrimStrings->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#41 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\ValidatePostSize.php(27): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#42 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\ValidatePostSize->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#43 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\PreventRequestsDuringMaintenance.php(99): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#44 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\PreventRequestsDuringMaintenance->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#45 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Middleware\\HandleCors.php(49): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#46 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Http\\Middleware\\HandleCors->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#47 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Middleware\\TrustProxies.php(39): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#48 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Http\\Middleware\\TrustProxies->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#49 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(119): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#50 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(175): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))
#51 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(144): Illuminate\\Foundation\\Http\\Kernel->sendRequestThroughRouter(Object(Illuminate\\Http\\Request))
#52 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\public\\index.php(51): Illuminate\\Foundation\\Http\\Kernel->handle(Object(Illuminate\\Http\\Request))
#53 {main}

[previous exception] [object] (ErrorException(code: 0): Undefined property: stdClass::$direction_nubmer at C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\storage\\framework\\views\\f1863c58f54826ce8fd79442db39d1b5.php:53)
[stacktrace]
#0 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Bootstrap\\HandleExceptions.php(255): Illuminate\\Foundation\\Bootstrap\\HandleExceptions->handleError(2, 'Undefined prope...', 'C:\\\\Users\\\\Abdul ...', 53)
#1 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\storage\\framework\\views\\f1863c58f54826ce8fd79442db39d1b5.php(53): Illuminate\\Foundation\\Bootstrap\\HandleExceptions->Illuminate\\Foundation\\Bootstrap\\{closure}(2, 'Undefined prope...', 'C:\\\\Users\\\\Abdul ...', 53)
#2 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Filesystem\\Filesystem.php(124): require('C:\\\\Users\\\\Abdul ...')
#3 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Filesystem\\Filesystem.php(125): Illuminate\\Filesystem\\Filesystem::Illuminate\\Filesystem\\{closure}()
#4 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\Engines\\PhpEngine.php(58): Illuminate\\Filesystem\\Filesystem->getRequire('C:\\\\Users\\\\Abdul ...', Array)
#5 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\Engines\\CompilerEngine.php(72): Illuminate\\View\\Engines\\PhpEngine->evaluatePath('C:\\\\Users\\\\Abdul ...', Array)
#6 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(207): Illuminate\\View\\Engines\\CompilerEngine->get('C:\\\\Users\\\\Abdul ...', Array)
#7 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(190): Illuminate\\View\\View->getContents()
#8 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(159): Illuminate\\View\\View->renderContents()
#9 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Response.php(69): Illuminate\\View\\View->render()
#10 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Response.php(35): Illuminate\\Http\\Response->setContent(Object(Illuminate\\View\\View))
#11 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(918): Illuminate\\Http\\Response->__construct(Object(Illuminate\\View\\View), 200, Array)
#12 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(885): Illuminate\\Routing\\Router::toResponse(Object(Illuminate\\Http\\Request), Object(Illuminate\\View\\View))
#13 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(805): Illuminate\\Routing\\Router->prepareResponse(Object(Illuminate\\Http\\Request), Object(Illuminate\\View\\View))
#14 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(144): Illuminate\\Routing\\Router->Illuminate\\Routing\\{closure}(Object(Illuminate\\Http\\Request))
#15 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Middleware\\SubstituteBindings.php(50): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#16 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Routing\\Middleware\\SubstituteBindings->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#17 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\VerifyCsrfToken.php(78): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#18 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\VerifyCsrfToken->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#19 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\Middleware\\ShareErrorsFromSession.php(49): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#20 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\View\\Middleware\\ShareErrorsFromSession->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#21 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Middleware\\StartSession.php(121): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#22 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Middleware\\StartSession.php(64): Illuminate\\Session\\Middleware\\StartSession->handleStatefulRequest(Object(Illuminate\\Http\\Request), Object(Illuminate\\Session\\Store), Object(Closure))
#23 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Session\\Middleware\\StartSession->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#24 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Cookie\\Middleware\\AddQueuedCookiesToResponse.php(37): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#25 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Cookie\\Middleware\\AddQueuedCookiesToResponse->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#26 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Cookie\\Middleware\\EncryptCookies.php(67): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#27 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Cookie\\Middleware\\EncryptCookies->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#28 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(119): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#29 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(805): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))
#30 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(784): Illuminate\\Routing\\Router->runRouteWithinStack(Object(Illuminate\\Routing\\Route), Object(Illuminate\\Http\\Request))
#31 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(748): Illuminate\\Routing\\Router->runRoute(Object(Illuminate\\Http\\Request), Object(Illuminate\\Routing\\Route))
#32 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(737): Illuminate\\Routing\\Router->dispatchToRoute(Object(Illuminate\\Http\\Request))
#33 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(200): Illuminate\\Routing\\Router->dispatch(Object(Illuminate\\Http\\Request))
#34 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(144): Illuminate\\Foundation\\Http\\Kernel->Illuminate\\Foundation\\Http\\{closure}(Object(Illuminate\\Http\\Request))
#35 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest.php(21): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#36 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\ConvertEmptyStringsToNull.php(31): Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#37 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\ConvertEmptyStringsToNull->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#38 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest.php(21): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#39 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TrimStrings.php(40): Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#40 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\TrimStrings->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#41 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\ValidatePostSize.php(27): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#42 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\ValidatePostSize->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#43 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\PreventRequestsDuringMaintenance.php(99): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#44 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\PreventRequestsDuringMaintenance->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#45 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Middleware\\HandleCors.php(49): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#46 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Http\\Middleware\\HandleCors->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#47 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Middleware\\TrustProxies.php(39): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#48 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Http\\Middleware\\TrustProxies->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#49 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(119): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#50 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(175): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))
#51 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(144): Illuminate\\Foundation\\Http\\Kernel->sendRequestThroughRouter(Object(Illuminate\\Http\\Request))
#52 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\public\\index.php(51): Illuminate\\Foundation\\Http\\Kernel->handle(Object(Illuminate\\Http\\Request))
#53 {main}
"} 
[2024-03-23 07:56:00] local.ERROR: Undefined property: stdClass::$direction_nubmer {"view":{"view":"C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\resources\\views\\admin\\owner\\print_sponser.blade.php","data":{"errors":"<pre class=sf-dump id=sf-dump-399761352 data-indent-pad=\"  \"><span class=sf-dump-note>Illuminate\\Support\\ViewErrorBag</span> {<a class=sf-dump-ref>#1313</a><samp data-depth=1 class=sf-dump-expanded>
  #<span class=sf-dump-protected title=\"Protected property\">bags</span>: []
</samp>}
</pre><script>Sfdump(\"sf-dump-399761352\", {\"maxDepth\":3,\"maxStringLength\":160})</script>
","select_owners":"<pre class=sf-dump id=sf-dump-287744555 data-indent-pad=\"  \"><span class=sf-dump-note>Illuminate\\Support\\Collection</span> {<a class=sf-dump-ref>#1336</a><samp data-depth=1 class=sf-dump-expanded>
  #<span class=sf-dump-protected title=\"Protected property\">items</span>: <span class=sf-dump-note>array:1</span> [<samp data-depth=2 class=sf-dump-compact>
    <span class=sf-dump-index>0</span> => {<a class=sf-dump-ref>#1338</a><samp data-depth=3 class=sf-dump-compact>
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">id</span>\": <span class=sf-dump-num>3</span>
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">name</span>\": \"<span class=sf-dump-str title=\"6 characters\">&#1605;&#1740;&#1585;&#1608;&#1740;&#1587;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">last_name</span>\": \"<span class=sf-dump-str title=\"5 characters\">&#1605;&#1608;&#1605;&#1606;&#1583;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">Engine_no</span>\": \"<span class=sf-dump-str title=\"6 characters\">123034</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">from_add</span>\": \"<span class=sf-dump-str title=\"9 characters\">&#1670;&#1608;&#1705; &#1578;&#1604;&#1575;&#1588;&#1741;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">to_add</span>\": \"<span class=sf-dump-str title=\"8 characters\">&#1705;&#1575;&#1576;&#1604; &#1607;&#1673;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">direction_number</span>\": <span class=sf-dump-num>100</span>
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">shase_no</span>\": \"<span class=sf-dump-str title=\"5 characters\">30103</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">plate_no</span>\": \"<span class=sf-dump-str title=\"3 characters\">100</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">father_name</span>\": \"<span class=sf-dump-str title=\"9 characters\">&#1593;&#1589;&#1605;&#1578; &#1575;&#1604;&#1604;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">permenant_village</span>\": \"<span class=sf-dump-str title=\"6 characters\">&#1588;&#1576;&#1583;&#1740;&#1575;&#1606;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">current_village</span>\": \"<span class=sf-dump-str title=\"9 characters\">&#1662;&#1575;&#1587; &#1662;&#1594;&#1605;&#1575;&#1606;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">owner_job</span>\": \"<span class=sf-dump-str title=\"5 characters\">&#1673;&#1575;&#1705;&#1660;&#1585;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">nic_number</span>\": \"<span class=sf-dump-str title=\"4 characters\">1400</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">phone_number</span>\": \"<span class=sf-dump-str title=\"10 characters\">0775294943</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">image</span>\": \"<span class=sf-dump-str title=\"24 characters\">masy6h78ng9hpkwrcplq.jpg</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">per_provine_name</span>\": \"<span class=sf-dump-str title=\"7 characters\">&#1606;&#1606;&#1707;&#1585;&#1607;&#1575;&#1585;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">current_pro_name</span>\": \"<span class=sf-dump-str title=\"4 characters\">&#1705;&#1575;&#1576;&#1604;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">per_dist_name</span>\": \"<span class=sf-dump-str title=\"7 characters\">&#1576;&#1660;&#1610; &#1705;&#1608;&#1660;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">current_dist_name</span>\": \"<span class=sf-dump-str title=\"5 characters\">&#1662;&#1594;&#1605;&#1575;&#1606;</span>\"
    </samp>}
  </samp>]
  #<span class=sf-dump-protected title=\"Protected property\">escapeWhenCastingToString</span>: <span class=sf-dump-const>false</span>
</samp>}
</pre><script>Sfdump(\"sf-dump-287744555\", {\"maxDepth\":3,\"maxStringLength\":160})</script>
","get_sponsers":"<pre class=sf-dump id=sf-dump-1229413726 data-indent-pad=\"  \"><span class=sf-dump-note>Illuminate\\Support\\Collection</span> {<a class=sf-dump-ref>#1335</a><samp data-depth=1 class=sf-dump-expanded>
  #<span class=sf-dump-protected title=\"Protected property\">items</span>: <span class=sf-dump-note>array:1</span> [<samp data-depth=2 class=sf-dump-compact>
    <span class=sf-dump-index>0</span> => {<a class=sf-dump-ref>#1342</a><samp data-depth=3 class=sf-dump-compact>
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">owner_code</span>\": <span class=sf-dump-num>3</span>
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">name</span>\": \"<span class=sf-dump-str title=\"6 characters\">&#1605;&#1740;&#1585;&#1608;&#1740;&#1587;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">last_name</span>\": \"<span class=sf-dump-str title=\"5 characters\">&#1605;&#1608;&#1605;&#1606;&#1583;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">father_name</span>\": \"<span class=sf-dump-str title=\"9 characters\">&#1593;&#1589;&#1605;&#1578; &#1575;&#1604;&#1604;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">grand_fname</span>\": \"<span class=sf-dump-str title=\"7 characters\">&#1575;&#1581;&#1605;&#1583;&#1588;&#1575;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">sponser_name</span>\": \"<span class=sf-dump-str title=\"9 characters\">&#1593;&#1589;&#1605;&#1578; &#1575;&#1604;&#1604;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">sponsor_fname</span>\": \"<span class=sf-dump-str title=\"7 characters\">&#1575;&#1581;&#1605;&#1583;&#1588;&#1575;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">per_village</span>\": \"<span class=sf-dump-str title=\"14 characters\">&#1602;&#1604;&#1593;&#1607; &#1580;&#1575;&#1606;&#1575;&#1606; &#1582;&#1575;&#1606;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">cur_village</span>\": \"<span class=sf-dump-str title=\"4 characters\">&#1602;&#1585;&#1594;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">phone_number</span>\": \"<span class=sf-dump-str title=\"11 characters\">07759543534</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">approval_barharli</span>\": \"\"\"
        <span class=sf-dump-str title=\"43 characters\">&#1606;&#1608;&#1605;&#1608;&#1683;&#1610; &#1588;&#1582;&#1589; &#1576;&#1585;&#1581;&#1575;&#1604;&#1610; &#1578;&#1575;&#1740;&#1740;&#1583; &#1583;&#1607;. <span class=\"sf-dump-default sf-dump-ns\">\\r\\n</span></span>
        <span class=sf-dump-str title=\"43 characters\">&#1608;&#1586;&#1575;&#1585;&#1578; &#1605;&#1582;&#1575;&#1576;&#1585;&#1575;&#1578;</span>
        \"\"\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">sponsor_image</span>\": \"<span class=sf-dump-str title=\"24 characters\">ilwdmgyhsozfdbfonpjz.jpg</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">per_provine_name</span>\": \"<span class=sf-dump-str title=\"7 characters\">&#1606;&#1606;&#1707;&#1585;&#1607;&#1575;&#1585;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">current_pro_name</span>\": \"<span class=sf-dump-str title=\"4 characters\">&#1705;&#1575;&#1576;&#1604;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">per_dist_name</span>\": \"<span class=sf-dump-str title=\"4 characters\">&#1705;&#1575;&#1605;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">current_dist_name</span>\": \"<span class=sf-dump-str title=\"5 characters\">&#1662;&#1594;&#1605;&#1575;&#1606;</span>\"
    </samp>}
  </samp>]
  #<span class=sf-dump-protected title=\"Protected property\">escapeWhenCastingToString</span>: <span class=sf-dump-const>false</span>
</samp>}
</pre><script>Sfdump(\"sf-dump-1229413726\", {\"maxDepth\":3,\"maxStringLength\":160})</script>
"}},"userId":4,"exception":"[object] (Spatie\\LaravelIgnition\\Exceptions\\ViewException(code: 0): Undefined property: stdClass::$direction_nubmer at C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\resources\\views\\admin\\owner\\print_sponser.blade.php:53)
[stacktrace]
#0 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Bootstrap\\HandleExceptions.php(255): Illuminate\\Foundation\\Bootstrap\\HandleExceptions->handleError(2, 'Undefined prope...', 'C:\\\\Users\\\\Abdul ...', 53)
#1 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\resources\\views\\admin\\owner\\print_sponser.blade.php(53): Illuminate\\Foundation\\Bootstrap\\HandleExceptions->Illuminate\\Foundation\\Bootstrap\\{closure}(2, 'Undefined prope...', 'C:\\\\Users\\\\Abdul ...', 53)
#2 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Filesystem\\Filesystem.php(124): require('C:\\\\Users\\\\Abdul ...')
#3 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Filesystem\\Filesystem.php(125): Illuminate\\Filesystem\\Filesystem::Illuminate\\Filesystem\\{closure}()
#4 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\Engines\\PhpEngine.php(58): Illuminate\\Filesystem\\Filesystem->getRequire('C:\\\\Users\\\\Abdul ...', Array)
#5 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\Engines\\CompilerEngine.php(72): Illuminate\\View\\Engines\\PhpEngine->evaluatePath('C:\\\\Users\\\\Abdul ...', Array)
#6 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(207): Illuminate\\View\\Engines\\CompilerEngine->get('C:\\\\Users\\\\Abdul ...', Array)
#7 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(190): Illuminate\\View\\View->getContents()
#8 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(159): Illuminate\\View\\View->renderContents()
#9 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Response.php(69): Illuminate\\View\\View->render()
#10 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Response.php(35): Illuminate\\Http\\Response->setContent(Object(Illuminate\\View\\View))
#11 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(918): Illuminate\\Http\\Response->__construct(Object(Illuminate\\View\\View), 200, Array)
#12 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(885): Illuminate\\Routing\\Router::toResponse(Object(Illuminate\\Http\\Request), Object(Illuminate\\View\\View))
#13 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(805): Illuminate\\Routing\\Router->prepareResponse(Object(Illuminate\\Http\\Request), Object(Illuminate\\View\\View))
#14 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(144): Illuminate\\Routing\\Router->Illuminate\\Routing\\{closure}(Object(Illuminate\\Http\\Request))
#15 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Middleware\\SubstituteBindings.php(50): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#16 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Routing\\Middleware\\SubstituteBindings->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#17 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\VerifyCsrfToken.php(78): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#18 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\VerifyCsrfToken->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#19 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\Middleware\\ShareErrorsFromSession.php(49): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#20 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\View\\Middleware\\ShareErrorsFromSession->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#21 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Middleware\\StartSession.php(121): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#22 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Middleware\\StartSession.php(64): Illuminate\\Session\\Middleware\\StartSession->handleStatefulRequest(Object(Illuminate\\Http\\Request), Object(Illuminate\\Session\\Store), Object(Closure))
#23 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Session\\Middleware\\StartSession->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#24 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Cookie\\Middleware\\AddQueuedCookiesToResponse.php(37): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#25 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Cookie\\Middleware\\AddQueuedCookiesToResponse->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#26 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Cookie\\Middleware\\EncryptCookies.php(67): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#27 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Cookie\\Middleware\\EncryptCookies->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#28 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(119): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#29 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(805): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))
#30 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(784): Illuminate\\Routing\\Router->runRouteWithinStack(Object(Illuminate\\Routing\\Route), Object(Illuminate\\Http\\Request))
#31 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(748): Illuminate\\Routing\\Router->runRoute(Object(Illuminate\\Http\\Request), Object(Illuminate\\Routing\\Route))
#32 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(737): Illuminate\\Routing\\Router->dispatchToRoute(Object(Illuminate\\Http\\Request))
#33 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(200): Illuminate\\Routing\\Router->dispatch(Object(Illuminate\\Http\\Request))
#34 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(144): Illuminate\\Foundation\\Http\\Kernel->Illuminate\\Foundation\\Http\\{closure}(Object(Illuminate\\Http\\Request))
#35 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest.php(21): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#36 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\ConvertEmptyStringsToNull.php(31): Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#37 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\ConvertEmptyStringsToNull->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#38 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest.php(21): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#39 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TrimStrings.php(40): Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#40 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\TrimStrings->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#41 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\ValidatePostSize.php(27): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#42 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\ValidatePostSize->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#43 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\PreventRequestsDuringMaintenance.php(99): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#44 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\PreventRequestsDuringMaintenance->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#45 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Middleware\\HandleCors.php(49): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#46 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Http\\Middleware\\HandleCors->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#47 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Middleware\\TrustProxies.php(39): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#48 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Http\\Middleware\\TrustProxies->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#49 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(119): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#50 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(175): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))
#51 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(144): Illuminate\\Foundation\\Http\\Kernel->sendRequestThroughRouter(Object(Illuminate\\Http\\Request))
#52 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\public\\index.php(51): Illuminate\\Foundation\\Http\\Kernel->handle(Object(Illuminate\\Http\\Request))
#53 {main}

[previous exception] [object] (ErrorException(code: 0): Undefined property: stdClass::$direction_nubmer at C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\storage\\framework\\views\\f1863c58f54826ce8fd79442db39d1b5.php:53)
[stacktrace]
#0 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Bootstrap\\HandleExceptions.php(255): Illuminate\\Foundation\\Bootstrap\\HandleExceptions->handleError(2, 'Undefined prope...', 'C:\\\\Users\\\\Abdul ...', 53)
#1 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\storage\\framework\\views\\f1863c58f54826ce8fd79442db39d1b5.php(53): Illuminate\\Foundation\\Bootstrap\\HandleExceptions->Illuminate\\Foundation\\Bootstrap\\{closure}(2, 'Undefined prope...', 'C:\\\\Users\\\\Abdul ...', 53)
#2 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Filesystem\\Filesystem.php(124): require('C:\\\\Users\\\\Abdul ...')
#3 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Filesystem\\Filesystem.php(125): Illuminate\\Filesystem\\Filesystem::Illuminate\\Filesystem\\{closure}()
#4 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\Engines\\PhpEngine.php(58): Illuminate\\Filesystem\\Filesystem->getRequire('C:\\\\Users\\\\Abdul ...', Array)
#5 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\Engines\\CompilerEngine.php(72): Illuminate\\View\\Engines\\PhpEngine->evaluatePath('C:\\\\Users\\\\Abdul ...', Array)
#6 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(207): Illuminate\\View\\Engines\\CompilerEngine->get('C:\\\\Users\\\\Abdul ...', Array)
#7 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(190): Illuminate\\View\\View->getContents()
#8 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(159): Illuminate\\View\\View->renderContents()
#9 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Response.php(69): Illuminate\\View\\View->render()
#10 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Response.php(35): Illuminate\\Http\\Response->setContent(Object(Illuminate\\View\\View))
#11 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(918): Illuminate\\Http\\Response->__construct(Object(Illuminate\\View\\View), 200, Array)
#12 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(885): Illuminate\\Routing\\Router::toResponse(Object(Illuminate\\Http\\Request), Object(Illuminate\\View\\View))
#13 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(805): Illuminate\\Routing\\Router->prepareResponse(Object(Illuminate\\Http\\Request), Object(Illuminate\\View\\View))
#14 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(144): Illuminate\\Routing\\Router->Illuminate\\Routing\\{closure}(Object(Illuminate\\Http\\Request))
#15 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Middleware\\SubstituteBindings.php(50): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#16 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Routing\\Middleware\\SubstituteBindings->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#17 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\VerifyCsrfToken.php(78): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#18 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\VerifyCsrfToken->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#19 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\Middleware\\ShareErrorsFromSession.php(49): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#20 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\View\\Middleware\\ShareErrorsFromSession->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#21 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Middleware\\StartSession.php(121): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#22 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Middleware\\StartSession.php(64): Illuminate\\Session\\Middleware\\StartSession->handleStatefulRequest(Object(Illuminate\\Http\\Request), Object(Illuminate\\Session\\Store), Object(Closure))
#23 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Session\\Middleware\\StartSession->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#24 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Cookie\\Middleware\\AddQueuedCookiesToResponse.php(37): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#25 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Cookie\\Middleware\\AddQueuedCookiesToResponse->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#26 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Cookie\\Middleware\\EncryptCookies.php(67): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#27 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Cookie\\Middleware\\EncryptCookies->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#28 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(119): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#29 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(805): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))
#30 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(784): Illuminate\\Routing\\Router->runRouteWithinStack(Object(Illuminate\\Routing\\Route), Object(Illuminate\\Http\\Request))
#31 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(748): Illuminate\\Routing\\Router->runRoute(Object(Illuminate\\Http\\Request), Object(Illuminate\\Routing\\Route))
#32 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(737): Illuminate\\Routing\\Router->dispatchToRoute(Object(Illuminate\\Http\\Request))
#33 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(200): Illuminate\\Routing\\Router->dispatch(Object(Illuminate\\Http\\Request))
#34 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(144): Illuminate\\Foundation\\Http\\Kernel->Illuminate\\Foundation\\Http\\{closure}(Object(Illuminate\\Http\\Request))
#35 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest.php(21): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#36 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\ConvertEmptyStringsToNull.php(31): Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#37 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\ConvertEmptyStringsToNull->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#38 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest.php(21): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#39 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TrimStrings.php(40): Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#40 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\TrimStrings->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#41 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\ValidatePostSize.php(27): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#42 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\ValidatePostSize->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#43 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\PreventRequestsDuringMaintenance.php(99): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#44 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\PreventRequestsDuringMaintenance->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#45 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Middleware\\HandleCors.php(49): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#46 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Http\\Middleware\\HandleCors->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#47 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Middleware\\TrustProxies.php(39): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#48 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Http\\Middleware\\TrustProxies->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#49 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(119): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#50 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(175): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))
#51 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(144): Illuminate\\Foundation\\Http\\Kernel->sendRequestThroughRouter(Object(Illuminate\\Http\\Request))
#52 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\public\\index.php(51): Illuminate\\Foundation\\Http\\Kernel->handle(Object(Illuminate\\Http\\Request))
#53 {main}
"} 
[2024-03-23 08:10:10] local.ERROR: Undefined variable $prinnt_owner {"view":{"view":"C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\resources\\views\\admin\\owner\\print_sponser.blade.php","data":{"errors":"<pre class=sf-dump id=sf-dump-751989140 data-indent-pad=\"  \"><span class=sf-dump-note>Illuminate\\Support\\ViewErrorBag</span> {<a class=sf-dump-ref>#1313</a><samp data-depth=1 class=sf-dump-expanded>
  #<span class=sf-dump-protected title=\"Protected property\">bags</span>: []
</samp>}
</pre><script>Sfdump(\"sf-dump-751989140\", {\"maxDepth\":3,\"maxStringLength\":160})</script>
","select_owners":"<pre class=sf-dump id=sf-dump-1016019771 data-indent-pad=\"  \"><span class=sf-dump-note>Illuminate\\Support\\Collection</span> {<a class=sf-dump-ref>#1336</a><samp data-depth=1 class=sf-dump-expanded>
  #<span class=sf-dump-protected title=\"Protected property\">items</span>: <span class=sf-dump-note>array:1</span> [<samp data-depth=2 class=sf-dump-compact>
    <span class=sf-dump-index>0</span> => {<a class=sf-dump-ref>#1338</a><samp data-depth=3 class=sf-dump-compact>
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">id</span>\": <span class=sf-dump-num>3</span>
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">name</span>\": \"<span class=sf-dump-str title=\"6 characters\">&#1605;&#1740;&#1585;&#1608;&#1740;&#1587;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">last_name</span>\": \"<span class=sf-dump-str title=\"5 characters\">&#1605;&#1608;&#1605;&#1606;&#1583;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">Engine_no</span>\": \"<span class=sf-dump-str title=\"6 characters\">123034</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">from_add</span>\": \"<span class=sf-dump-str title=\"9 characters\">&#1670;&#1608;&#1705; &#1578;&#1604;&#1575;&#1588;&#1741;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">to_add</span>\": \"<span class=sf-dump-str title=\"8 characters\">&#1705;&#1575;&#1576;&#1604; &#1607;&#1673;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">direction_number</span>\": <span class=sf-dump-num>100</span>
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">shase_no</span>\": \"<span class=sf-dump-str title=\"5 characters\">30103</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">plate_no</span>\": \"<span class=sf-dump-str title=\"3 characters\">100</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">father_name</span>\": \"<span class=sf-dump-str title=\"9 characters\">&#1593;&#1589;&#1605;&#1578; &#1575;&#1604;&#1604;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">permenant_village</span>\": \"<span class=sf-dump-str title=\"6 characters\">&#1588;&#1576;&#1583;&#1740;&#1575;&#1606;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">current_village</span>\": \"<span class=sf-dump-str title=\"9 characters\">&#1662;&#1575;&#1587; &#1662;&#1594;&#1605;&#1575;&#1606;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">owner_job</span>\": \"<span class=sf-dump-str title=\"5 characters\">&#1673;&#1575;&#1705;&#1660;&#1585;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">nic_number</span>\": \"<span class=sf-dump-str title=\"4 characters\">1400</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">phone_number</span>\": \"<span class=sf-dump-str title=\"10 characters\">0775294943</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">image</span>\": \"<span class=sf-dump-str title=\"24 characters\">masy6h78ng9hpkwrcplq.jpg</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">per_provine_name</span>\": \"<span class=sf-dump-str title=\"7 characters\">&#1606;&#1606;&#1707;&#1585;&#1607;&#1575;&#1585;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">current_pro_name</span>\": \"<span class=sf-dump-str title=\"4 characters\">&#1705;&#1575;&#1576;&#1604;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">per_dist_name</span>\": \"<span class=sf-dump-str title=\"7 characters\">&#1576;&#1660;&#1610; &#1705;&#1608;&#1660;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">current_dist_name</span>\": \"<span class=sf-dump-str title=\"5 characters\">&#1662;&#1594;&#1605;&#1575;&#1606;</span>\"
    </samp>}
  </samp>]
  #<span class=sf-dump-protected title=\"Protected property\">escapeWhenCastingToString</span>: <span class=sf-dump-const>false</span>
</samp>}
</pre><script>Sfdump(\"sf-dump-1016019771\", {\"maxDepth\":3,\"maxStringLength\":160})</script>
","get_sponsers":"<pre class=sf-dump id=sf-dump-1038877798 data-indent-pad=\"  \"><span class=sf-dump-note>Illuminate\\Support\\Collection</span> {<a class=sf-dump-ref>#1335</a><samp data-depth=1 class=sf-dump-expanded>
  #<span class=sf-dump-protected title=\"Protected property\">items</span>: <span class=sf-dump-note>array:1</span> [<samp data-depth=2 class=sf-dump-compact>
    <span class=sf-dump-index>0</span> => {<a class=sf-dump-ref>#1342</a><samp data-depth=3 class=sf-dump-compact>
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">owner_code</span>\": <span class=sf-dump-num>3</span>
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">name</span>\": \"<span class=sf-dump-str title=\"6 characters\">&#1605;&#1740;&#1585;&#1608;&#1740;&#1587;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">last_name</span>\": \"<span class=sf-dump-str title=\"5 characters\">&#1605;&#1608;&#1605;&#1606;&#1583;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">father_name</span>\": \"<span class=sf-dump-str title=\"9 characters\">&#1593;&#1589;&#1605;&#1578; &#1575;&#1604;&#1604;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">grand_fname</span>\": \"<span class=sf-dump-str title=\"7 characters\">&#1575;&#1581;&#1605;&#1583;&#1588;&#1575;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">sponser_name</span>\": \"<span class=sf-dump-str title=\"9 characters\">&#1593;&#1589;&#1605;&#1578; &#1575;&#1604;&#1604;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">sponsor_fname</span>\": \"<span class=sf-dump-str title=\"7 characters\">&#1575;&#1581;&#1605;&#1583;&#1588;&#1575;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">per_village</span>\": \"<span class=sf-dump-str title=\"14 characters\">&#1602;&#1604;&#1593;&#1607; &#1580;&#1575;&#1606;&#1575;&#1606; &#1582;&#1575;&#1606;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">cur_village</span>\": \"<span class=sf-dump-str title=\"4 characters\">&#1602;&#1585;&#1594;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">phone_number</span>\": \"<span class=sf-dump-str title=\"11 characters\">07759543534</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">approval_barharli</span>\": \"\"\"
        <span class=sf-dump-str title=\"43 characters\">&#1606;&#1608;&#1605;&#1608;&#1683;&#1610; &#1588;&#1582;&#1589; &#1576;&#1585;&#1581;&#1575;&#1604;&#1610; &#1578;&#1575;&#1740;&#1740;&#1583; &#1583;&#1607;. <span class=\"sf-dump-default sf-dump-ns\">\\r\\n</span></span>
        <span class=sf-dump-str title=\"43 characters\">&#1608;&#1586;&#1575;&#1585;&#1578; &#1605;&#1582;&#1575;&#1576;&#1585;&#1575;&#1578;</span>
        \"\"\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">sponsor_image</span>\": \"<span class=sf-dump-str title=\"24 characters\">ilwdmgyhsozfdbfonpjz.jpg</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">per_provine_name</span>\": \"<span class=sf-dump-str title=\"7 characters\">&#1606;&#1606;&#1707;&#1585;&#1607;&#1575;&#1585;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">current_pro_name</span>\": \"<span class=sf-dump-str title=\"4 characters\">&#1705;&#1575;&#1576;&#1604;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">per_dist_name</span>\": \"<span class=sf-dump-str title=\"4 characters\">&#1705;&#1575;&#1605;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">current_dist_name</span>\": \"<span class=sf-dump-str title=\"5 characters\">&#1662;&#1594;&#1605;&#1575;&#1606;</span>\"
    </samp>}
  </samp>]
  #<span class=sf-dump-protected title=\"Protected property\">escapeWhenCastingToString</span>: <span class=sf-dump-const>false</span>
</samp>}
</pre><script>Sfdump(\"sf-dump-1038877798\", {\"maxDepth\":3,\"maxStringLength\":160})</script>
"}},"userId":4,"exception":"[object] (Spatie\\LaravelIgnition\\Exceptions\\ViewException(code: 0): Undefined variable $prinnt_owner at C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\resources\\views\\admin\\owner\\print_sponser.blade.php:95)
[stacktrace]
#0 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Bootstrap\\HandleExceptions.php(255): Illuminate\\Foundation\\Bootstrap\\HandleExceptions->handleError(2, 'Undefined varia...', 'C:\\\\Users\\\\Abdul ...', 95)
#1 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\resources\\views\\admin\\owner\\print_sponser.blade.php(95): Illuminate\\Foundation\\Bootstrap\\HandleExceptions->Illuminate\\Foundation\\Bootstrap\\{closure}(2, 'Undefined varia...', 'C:\\\\Users\\\\Abdul ...', 95)
#2 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Filesystem\\Filesystem.php(124): require('C:\\\\Users\\\\Abdul ...')
#3 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Filesystem\\Filesystem.php(125): Illuminate\\Filesystem\\Filesystem::Illuminate\\Filesystem\\{closure}()
#4 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\Engines\\PhpEngine.php(58): Illuminate\\Filesystem\\Filesystem->getRequire('C:\\\\Users\\\\Abdul ...', Array)
#5 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\Engines\\CompilerEngine.php(72): Illuminate\\View\\Engines\\PhpEngine->evaluatePath('C:\\\\Users\\\\Abdul ...', Array)
#6 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(207): Illuminate\\View\\Engines\\CompilerEngine->get('C:\\\\Users\\\\Abdul ...', Array)
#7 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(190): Illuminate\\View\\View->getContents()
#8 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(159): Illuminate\\View\\View->renderContents()
#9 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Response.php(69): Illuminate\\View\\View->render()
#10 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Response.php(35): Illuminate\\Http\\Response->setContent(Object(Illuminate\\View\\View))
#11 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(918): Illuminate\\Http\\Response->__construct(Object(Illuminate\\View\\View), 200, Array)
#12 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(885): Illuminate\\Routing\\Router::toResponse(Object(Illuminate\\Http\\Request), Object(Illuminate\\View\\View))
#13 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(805): Illuminate\\Routing\\Router->prepareResponse(Object(Illuminate\\Http\\Request), Object(Illuminate\\View\\View))
#14 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(144): Illuminate\\Routing\\Router->Illuminate\\Routing\\{closure}(Object(Illuminate\\Http\\Request))
#15 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Middleware\\SubstituteBindings.php(50): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#16 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Routing\\Middleware\\SubstituteBindings->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#17 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\VerifyCsrfToken.php(78): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#18 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\VerifyCsrfToken->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#19 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\Middleware\\ShareErrorsFromSession.php(49): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#20 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\View\\Middleware\\ShareErrorsFromSession->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#21 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Middleware\\StartSession.php(121): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#22 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Middleware\\StartSession.php(64): Illuminate\\Session\\Middleware\\StartSession->handleStatefulRequest(Object(Illuminate\\Http\\Request), Object(Illuminate\\Session\\Store), Object(Closure))
#23 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Session\\Middleware\\StartSession->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#24 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Cookie\\Middleware\\AddQueuedCookiesToResponse.php(37): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#25 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Cookie\\Middleware\\AddQueuedCookiesToResponse->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#26 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Cookie\\Middleware\\EncryptCookies.php(67): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#27 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Cookie\\Middleware\\EncryptCookies->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#28 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(119): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#29 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(805): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))
#30 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(784): Illuminate\\Routing\\Router->runRouteWithinStack(Object(Illuminate\\Routing\\Route), Object(Illuminate\\Http\\Request))
#31 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(748): Illuminate\\Routing\\Router->runRoute(Object(Illuminate\\Http\\Request), Object(Illuminate\\Routing\\Route))
#32 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(737): Illuminate\\Routing\\Router->dispatchToRoute(Object(Illuminate\\Http\\Request))
#33 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(200): Illuminate\\Routing\\Router->dispatch(Object(Illuminate\\Http\\Request))
#34 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(144): Illuminate\\Foundation\\Http\\Kernel->Illuminate\\Foundation\\Http\\{closure}(Object(Illuminate\\Http\\Request))
#35 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest.php(21): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#36 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\ConvertEmptyStringsToNull.php(31): Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#37 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\ConvertEmptyStringsToNull->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#38 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest.php(21): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#39 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TrimStrings.php(40): Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#40 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\TrimStrings->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#41 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\ValidatePostSize.php(27): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#42 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\ValidatePostSize->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#43 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\PreventRequestsDuringMaintenance.php(99): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#44 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\PreventRequestsDuringMaintenance->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#45 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Middleware\\HandleCors.php(49): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#46 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Http\\Middleware\\HandleCors->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#47 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Middleware\\TrustProxies.php(39): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#48 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Http\\Middleware\\TrustProxies->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#49 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(119): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#50 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(175): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))
#51 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(144): Illuminate\\Foundation\\Http\\Kernel->sendRequestThroughRouter(Object(Illuminate\\Http\\Request))
#52 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\public\\index.php(51): Illuminate\\Foundation\\Http\\Kernel->handle(Object(Illuminate\\Http\\Request))
#53 {main}

[previous exception] [object] (ErrorException(code: 0): Undefined variable $prinnt_owner at C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\storage\\framework\\views\\f1863c58f54826ce8fd79442db39d1b5.php:95)
[stacktrace]
#0 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Bootstrap\\HandleExceptions.php(255): Illuminate\\Foundation\\Bootstrap\\HandleExceptions->handleError(2, 'Undefined varia...', 'C:\\\\Users\\\\Abdul ...', 95)
#1 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\storage\\framework\\views\\f1863c58f54826ce8fd79442db39d1b5.php(95): Illuminate\\Foundation\\Bootstrap\\HandleExceptions->Illuminate\\Foundation\\Bootstrap\\{closure}(2, 'Undefined varia...', 'C:\\\\Users\\\\Abdul ...', 95)
#2 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Filesystem\\Filesystem.php(124): require('C:\\\\Users\\\\Abdul ...')
#3 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Filesystem\\Filesystem.php(125): Illuminate\\Filesystem\\Filesystem::Illuminate\\Filesystem\\{closure}()
#4 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\Engines\\PhpEngine.php(58): Illuminate\\Filesystem\\Filesystem->getRequire('C:\\\\Users\\\\Abdul ...', Array)
#5 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\Engines\\CompilerEngine.php(72): Illuminate\\View\\Engines\\PhpEngine->evaluatePath('C:\\\\Users\\\\Abdul ...', Array)
#6 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(207): Illuminate\\View\\Engines\\CompilerEngine->get('C:\\\\Users\\\\Abdul ...', Array)
#7 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(190): Illuminate\\View\\View->getContents()
#8 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(159): Illuminate\\View\\View->renderContents()
#9 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Response.php(69): Illuminate\\View\\View->render()
#10 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Response.php(35): Illuminate\\Http\\Response->setContent(Object(Illuminate\\View\\View))
#11 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(918): Illuminate\\Http\\Response->__construct(Object(Illuminate\\View\\View), 200, Array)
#12 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(885): Illuminate\\Routing\\Router::toResponse(Object(Illuminate\\Http\\Request), Object(Illuminate\\View\\View))
#13 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(805): Illuminate\\Routing\\Router->prepareResponse(Object(Illuminate\\Http\\Request), Object(Illuminate\\View\\View))
#14 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(144): Illuminate\\Routing\\Router->Illuminate\\Routing\\{closure}(Object(Illuminate\\Http\\Request))
#15 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Middleware\\SubstituteBindings.php(50): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#16 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Routing\\Middleware\\SubstituteBindings->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#17 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\VerifyCsrfToken.php(78): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#18 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\VerifyCsrfToken->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#19 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\Middleware\\ShareErrorsFromSession.php(49): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#20 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\View\\Middleware\\ShareErrorsFromSession->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#21 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Middleware\\StartSession.php(121): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#22 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Middleware\\StartSession.php(64): Illuminate\\Session\\Middleware\\StartSession->handleStatefulRequest(Object(Illuminate\\Http\\Request), Object(Illuminate\\Session\\Store), Object(Closure))
#23 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Session\\Middleware\\StartSession->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#24 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Cookie\\Middleware\\AddQueuedCookiesToResponse.php(37): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#25 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Cookie\\Middleware\\AddQueuedCookiesToResponse->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#26 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Cookie\\Middleware\\EncryptCookies.php(67): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#27 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Cookie\\Middleware\\EncryptCookies->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#28 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(119): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#29 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(805): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))
#30 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(784): Illuminate\\Routing\\Router->runRouteWithinStack(Object(Illuminate\\Routing\\Route), Object(Illuminate\\Http\\Request))
#31 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(748): Illuminate\\Routing\\Router->runRoute(Object(Illuminate\\Http\\Request), Object(Illuminate\\Routing\\Route))
#32 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(737): Illuminate\\Routing\\Router->dispatchToRoute(Object(Illuminate\\Http\\Request))
#33 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(200): Illuminate\\Routing\\Router->dispatch(Object(Illuminate\\Http\\Request))
#34 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(144): Illuminate\\Foundation\\Http\\Kernel->Illuminate\\Foundation\\Http\\{closure}(Object(Illuminate\\Http\\Request))
#35 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest.php(21): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#36 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\ConvertEmptyStringsToNull.php(31): Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#37 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\ConvertEmptyStringsToNull->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#38 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest.php(21): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#39 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TrimStrings.php(40): Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#40 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\TrimStrings->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#41 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\ValidatePostSize.php(27): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#42 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\ValidatePostSize->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#43 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\PreventRequestsDuringMaintenance.php(99): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#44 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\PreventRequestsDuringMaintenance->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#45 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Middleware\\HandleCors.php(49): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#46 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Http\\Middleware\\HandleCors->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#47 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Middleware\\TrustProxies.php(39): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#48 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Http\\Middleware\\TrustProxies->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#49 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(119): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#50 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(175): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))
#51 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(144): Illuminate\\Foundation\\Http\\Kernel->sendRequestThroughRouter(Object(Illuminate\\Http\\Request))
#52 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\public\\index.php(51): Illuminate\\Foundation\\Http\\Kernel->handle(Object(Illuminate\\Http\\Request))
#53 {main}
"} 
[2024-03-23 08:11:52] local.ERROR: Undefined property: stdClass::$per_province_name {"view":{"view":"C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\resources\\views\\admin\\owner\\print_sponser.blade.php","data":{"errors":"<pre class=sf-dump id=sf-dump-158170642 data-indent-pad=\"  \"><span class=sf-dump-note>Illuminate\\Support\\ViewErrorBag</span> {<a class=sf-dump-ref>#1313</a><samp data-depth=1 class=sf-dump-expanded>
  #<span class=sf-dump-protected title=\"Protected property\">bags</span>: []
</samp>}
</pre><script>Sfdump(\"sf-dump-158170642\", {\"maxDepth\":3,\"maxStringLength\":160})</script>
","select_owners":"<pre class=sf-dump id=sf-dump-1241950345 data-indent-pad=\"  \"><span class=sf-dump-note>Illuminate\\Support\\Collection</span> {<a class=sf-dump-ref>#1336</a><samp data-depth=1 class=sf-dump-expanded>
  #<span class=sf-dump-protected title=\"Protected property\">items</span>: <span class=sf-dump-note>array:1</span> [<samp data-depth=2 class=sf-dump-compact>
    <span class=sf-dump-index>0</span> => {<a class=sf-dump-ref>#1338</a><samp data-depth=3 class=sf-dump-compact>
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">id</span>\": <span class=sf-dump-num>3</span>
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">name</span>\": \"<span class=sf-dump-str title=\"6 characters\">&#1605;&#1740;&#1585;&#1608;&#1740;&#1587;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">last_name</span>\": \"<span class=sf-dump-str title=\"5 characters\">&#1605;&#1608;&#1605;&#1606;&#1583;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">grand_fname</span>\": \"<span class=sf-dump-str title=\"7 characters\">&#1575;&#1581;&#1605;&#1583;&#1588;&#1575;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">Engine_no</span>\": \"<span class=sf-dump-str title=\"6 characters\">123034</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">from_add</span>\": \"<span class=sf-dump-str title=\"9 characters\">&#1670;&#1608;&#1705; &#1578;&#1604;&#1575;&#1588;&#1741;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">to_add</span>\": \"<span class=sf-dump-str title=\"8 characters\">&#1705;&#1575;&#1576;&#1604; &#1607;&#1673;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">direction_number</span>\": <span class=sf-dump-num>100</span>
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">shase_no</span>\": \"<span class=sf-dump-str title=\"5 characters\">30103</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">plate_no</span>\": \"<span class=sf-dump-str title=\"3 characters\">100</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">father_name</span>\": \"<span class=sf-dump-str title=\"9 characters\">&#1593;&#1589;&#1605;&#1578; &#1575;&#1604;&#1604;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">permenant_village</span>\": \"<span class=sf-dump-str title=\"6 characters\">&#1588;&#1576;&#1583;&#1740;&#1575;&#1606;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">current_village</span>\": \"<span class=sf-dump-str title=\"9 characters\">&#1662;&#1575;&#1587; &#1662;&#1594;&#1605;&#1575;&#1606;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">owner_job</span>\": \"<span class=sf-dump-str title=\"5 characters\">&#1673;&#1575;&#1705;&#1660;&#1585;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">nic_number</span>\": \"<span class=sf-dump-str title=\"4 characters\">1400</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">phone_number</span>\": \"<span class=sf-dump-str title=\"10 characters\">0775294943</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">image</span>\": \"<span class=sf-dump-str title=\"24 characters\">masy6h78ng9hpkwrcplq.jpg</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">per_provine_name</span>\": \"<span class=sf-dump-str title=\"7 characters\">&#1606;&#1606;&#1707;&#1585;&#1607;&#1575;&#1585;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">current_pro_name</span>\": \"<span class=sf-dump-str title=\"4 characters\">&#1705;&#1575;&#1576;&#1604;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">per_dist_name</span>\": \"<span class=sf-dump-str title=\"7 characters\">&#1576;&#1660;&#1610; &#1705;&#1608;&#1660;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">current_dist_name</span>\": \"<span class=sf-dump-str title=\"5 characters\">&#1662;&#1594;&#1605;&#1575;&#1606;</span>\"
    </samp>}
  </samp>]
  #<span class=sf-dump-protected title=\"Protected property\">escapeWhenCastingToString</span>: <span class=sf-dump-const>false</span>
</samp>}
</pre><script>Sfdump(\"sf-dump-1241950345\", {\"maxDepth\":3,\"maxStringLength\":160})</script>
","get_sponsers":"<pre class=sf-dump id=sf-dump-481338647 data-indent-pad=\"  \"><span class=sf-dump-note>Illuminate\\Support\\Collection</span> {<a class=sf-dump-ref>#1335</a><samp data-depth=1 class=sf-dump-expanded>
  #<span class=sf-dump-protected title=\"Protected property\">items</span>: <span class=sf-dump-note>array:1</span> [<samp data-depth=2 class=sf-dump-compact>
    <span class=sf-dump-index>0</span> => {<a class=sf-dump-ref>#1342</a><samp data-depth=3 class=sf-dump-compact>
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">owner_code</span>\": <span class=sf-dump-num>3</span>
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">name</span>\": \"<span class=sf-dump-str title=\"6 characters\">&#1605;&#1740;&#1585;&#1608;&#1740;&#1587;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">last_name</span>\": \"<span class=sf-dump-str title=\"5 characters\">&#1605;&#1608;&#1605;&#1606;&#1583;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">father_name</span>\": \"<span class=sf-dump-str title=\"9 characters\">&#1593;&#1589;&#1605;&#1578; &#1575;&#1604;&#1604;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">grand_fname</span>\": \"<span class=sf-dump-str title=\"7 characters\">&#1575;&#1581;&#1605;&#1583;&#1588;&#1575;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">sponser_name</span>\": \"<span class=sf-dump-str title=\"9 characters\">&#1593;&#1589;&#1605;&#1578; &#1575;&#1604;&#1604;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">sponsor_fname</span>\": \"<span class=sf-dump-str title=\"7 characters\">&#1575;&#1581;&#1605;&#1583;&#1588;&#1575;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">per_village</span>\": \"<span class=sf-dump-str title=\"14 characters\">&#1602;&#1604;&#1593;&#1607; &#1580;&#1575;&#1606;&#1575;&#1606; &#1582;&#1575;&#1606;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">cur_village</span>\": \"<span class=sf-dump-str title=\"4 characters\">&#1602;&#1585;&#1594;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">phone_number</span>\": \"<span class=sf-dump-str title=\"11 characters\">07759543534</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">approval_barharli</span>\": \"\"\"
        <span class=sf-dump-str title=\"43 characters\">&#1606;&#1608;&#1605;&#1608;&#1683;&#1610; &#1588;&#1582;&#1589; &#1576;&#1585;&#1581;&#1575;&#1604;&#1610; &#1578;&#1575;&#1740;&#1740;&#1583; &#1583;&#1607;. <span class=\"sf-dump-default sf-dump-ns\">\\r\\n</span></span>
        <span class=sf-dump-str title=\"43 characters\">&#1608;&#1586;&#1575;&#1585;&#1578; &#1605;&#1582;&#1575;&#1576;&#1585;&#1575;&#1578;</span>
        \"\"\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">sponsor_image</span>\": \"<span class=sf-dump-str title=\"24 characters\">ilwdmgyhsozfdbfonpjz.jpg</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">per_provine_name</span>\": \"<span class=sf-dump-str title=\"7 characters\">&#1606;&#1606;&#1707;&#1585;&#1607;&#1575;&#1585;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">current_pro_name</span>\": \"<span class=sf-dump-str title=\"4 characters\">&#1705;&#1575;&#1576;&#1604;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">per_dist_name</span>\": \"<span class=sf-dump-str title=\"4 characters\">&#1705;&#1575;&#1605;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">current_dist_name</span>\": \"<span class=sf-dump-str title=\"5 characters\">&#1662;&#1594;&#1605;&#1575;&#1606;</span>\"
    </samp>}
  </samp>]
  #<span class=sf-dump-protected title=\"Protected property\">escapeWhenCastingToString</span>: <span class=sf-dump-const>false</span>
</samp>}
</pre><script>Sfdump(\"sf-dump-481338647\", {\"maxDepth\":3,\"maxStringLength\":160})</script>
"}},"userId":4,"exception":"[object] (Spatie\\LaravelIgnition\\Exceptions\\ViewException(code: 0): Undefined property: stdClass::$per_province_name at C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\resources\\views\\admin\\owner\\print_sponser.blade.php:93)
[stacktrace]
#0 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Bootstrap\\HandleExceptions.php(255): Illuminate\\Foundation\\Bootstrap\\HandleExceptions->handleError(2, 'Undefined prope...', 'C:\\\\Users\\\\Abdul ...', 93)
#1 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\resources\\views\\admin\\owner\\print_sponser.blade.php(93): Illuminate\\Foundation\\Bootstrap\\HandleExceptions->Illuminate\\Foundation\\Bootstrap\\{closure}(2, 'Undefined prope...', 'C:\\\\Users\\\\Abdul ...', 93)
#2 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Filesystem\\Filesystem.php(124): require('C:\\\\Users\\\\Abdul ...')
#3 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Filesystem\\Filesystem.php(125): Illuminate\\Filesystem\\Filesystem::Illuminate\\Filesystem\\{closure}()
#4 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\Engines\\PhpEngine.php(58): Illuminate\\Filesystem\\Filesystem->getRequire('C:\\\\Users\\\\Abdul ...', Array)
#5 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\Engines\\CompilerEngine.php(72): Illuminate\\View\\Engines\\PhpEngine->evaluatePath('C:\\\\Users\\\\Abdul ...', Array)
#6 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(207): Illuminate\\View\\Engines\\CompilerEngine->get('C:\\\\Users\\\\Abdul ...', Array)
#7 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(190): Illuminate\\View\\View->getContents()
#8 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(159): Illuminate\\View\\View->renderContents()
#9 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Response.php(69): Illuminate\\View\\View->render()
#10 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Response.php(35): Illuminate\\Http\\Response->setContent(Object(Illuminate\\View\\View))
#11 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(918): Illuminate\\Http\\Response->__construct(Object(Illuminate\\View\\View), 200, Array)
#12 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(885): Illuminate\\Routing\\Router::toResponse(Object(Illuminate\\Http\\Request), Object(Illuminate\\View\\View))
#13 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(805): Illuminate\\Routing\\Router->prepareResponse(Object(Illuminate\\Http\\Request), Object(Illuminate\\View\\View))
#14 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(144): Illuminate\\Routing\\Router->Illuminate\\Routing\\{closure}(Object(Illuminate\\Http\\Request))
#15 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Middleware\\SubstituteBindings.php(50): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#16 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Routing\\Middleware\\SubstituteBindings->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#17 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\VerifyCsrfToken.php(78): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#18 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\VerifyCsrfToken->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#19 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\Middleware\\ShareErrorsFromSession.php(49): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#20 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\View\\Middleware\\ShareErrorsFromSession->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#21 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Middleware\\StartSession.php(121): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#22 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Middleware\\StartSession.php(64): Illuminate\\Session\\Middleware\\StartSession->handleStatefulRequest(Object(Illuminate\\Http\\Request), Object(Illuminate\\Session\\Store), Object(Closure))
#23 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Session\\Middleware\\StartSession->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#24 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Cookie\\Middleware\\AddQueuedCookiesToResponse.php(37): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#25 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Cookie\\Middleware\\AddQueuedCookiesToResponse->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#26 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Cookie\\Middleware\\EncryptCookies.php(67): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#27 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Cookie\\Middleware\\EncryptCookies->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#28 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(119): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#29 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(805): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))
#30 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(784): Illuminate\\Routing\\Router->runRouteWithinStack(Object(Illuminate\\Routing\\Route), Object(Illuminate\\Http\\Request))
#31 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(748): Illuminate\\Routing\\Router->runRoute(Object(Illuminate\\Http\\Request), Object(Illuminate\\Routing\\Route))
#32 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(737): Illuminate\\Routing\\Router->dispatchToRoute(Object(Illuminate\\Http\\Request))
#33 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(200): Illuminate\\Routing\\Router->dispatch(Object(Illuminate\\Http\\Request))
#34 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(144): Illuminate\\Foundation\\Http\\Kernel->Illuminate\\Foundation\\Http\\{closure}(Object(Illuminate\\Http\\Request))
#35 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest.php(21): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#36 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\ConvertEmptyStringsToNull.php(31): Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#37 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\ConvertEmptyStringsToNull->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#38 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest.php(21): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#39 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TrimStrings.php(40): Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#40 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\TrimStrings->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#41 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\ValidatePostSize.php(27): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#42 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\ValidatePostSize->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#43 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\PreventRequestsDuringMaintenance.php(99): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#44 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\PreventRequestsDuringMaintenance->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#45 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Middleware\\HandleCors.php(49): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#46 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Http\\Middleware\\HandleCors->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#47 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Middleware\\TrustProxies.php(39): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#48 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Http\\Middleware\\TrustProxies->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#49 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(119): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#50 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(175): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))
#51 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(144): Illuminate\\Foundation\\Http\\Kernel->sendRequestThroughRouter(Object(Illuminate\\Http\\Request))
#52 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\public\\index.php(51): Illuminate\\Foundation\\Http\\Kernel->handle(Object(Illuminate\\Http\\Request))
#53 {main}

[previous exception] [object] (ErrorException(code: 0): Undefined property: stdClass::$per_province_name at C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\storage\\framework\\views\\f1863c58f54826ce8fd79442db39d1b5.php:93)
[stacktrace]
#0 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Bootstrap\\HandleExceptions.php(255): Illuminate\\Foundation\\Bootstrap\\HandleExceptions->handleError(2, 'Undefined prope...', 'C:\\\\Users\\\\Abdul ...', 93)
#1 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\storage\\framework\\views\\f1863c58f54826ce8fd79442db39d1b5.php(93): Illuminate\\Foundation\\Bootstrap\\HandleExceptions->Illuminate\\Foundation\\Bootstrap\\{closure}(2, 'Undefined prope...', 'C:\\\\Users\\\\Abdul ...', 93)
#2 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Filesystem\\Filesystem.php(124): require('C:\\\\Users\\\\Abdul ...')
#3 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Filesystem\\Filesystem.php(125): Illuminate\\Filesystem\\Filesystem::Illuminate\\Filesystem\\{closure}()
#4 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\Engines\\PhpEngine.php(58): Illuminate\\Filesystem\\Filesystem->getRequire('C:\\\\Users\\\\Abdul ...', Array)
#5 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\Engines\\CompilerEngine.php(72): Illuminate\\View\\Engines\\PhpEngine->evaluatePath('C:\\\\Users\\\\Abdul ...', Array)
#6 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(207): Illuminate\\View\\Engines\\CompilerEngine->get('C:\\\\Users\\\\Abdul ...', Array)
#7 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(190): Illuminate\\View\\View->getContents()
#8 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(159): Illuminate\\View\\View->renderContents()
#9 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Response.php(69): Illuminate\\View\\View->render()
#10 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Response.php(35): Illuminate\\Http\\Response->setContent(Object(Illuminate\\View\\View))
#11 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(918): Illuminate\\Http\\Response->__construct(Object(Illuminate\\View\\View), 200, Array)
#12 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(885): Illuminate\\Routing\\Router::toResponse(Object(Illuminate\\Http\\Request), Object(Illuminate\\View\\View))
#13 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(805): Illuminate\\Routing\\Router->prepareResponse(Object(Illuminate\\Http\\Request), Object(Illuminate\\View\\View))
#14 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(144): Illuminate\\Routing\\Router->Illuminate\\Routing\\{closure}(Object(Illuminate\\Http\\Request))
#15 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Middleware\\SubstituteBindings.php(50): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#16 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Routing\\Middleware\\SubstituteBindings->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#17 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\VerifyCsrfToken.php(78): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#18 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\VerifyCsrfToken->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#19 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\Middleware\\ShareErrorsFromSession.php(49): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#20 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\View\\Middleware\\ShareErrorsFromSession->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#21 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Middleware\\StartSession.php(121): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#22 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Middleware\\StartSession.php(64): Illuminate\\Session\\Middleware\\StartSession->handleStatefulRequest(Object(Illuminate\\Http\\Request), Object(Illuminate\\Session\\Store), Object(Closure))
#23 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Session\\Middleware\\StartSession->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#24 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Cookie\\Middleware\\AddQueuedCookiesToResponse.php(37): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#25 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Cookie\\Middleware\\AddQueuedCookiesToResponse->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#26 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Cookie\\Middleware\\EncryptCookies.php(67): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#27 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Cookie\\Middleware\\EncryptCookies->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#28 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(119): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#29 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(805): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))
#30 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(784): Illuminate\\Routing\\Router->runRouteWithinStack(Object(Illuminate\\Routing\\Route), Object(Illuminate\\Http\\Request))
#31 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(748): Illuminate\\Routing\\Router->runRoute(Object(Illuminate\\Http\\Request), Object(Illuminate\\Routing\\Route))
#32 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(737): Illuminate\\Routing\\Router->dispatchToRoute(Object(Illuminate\\Http\\Request))
#33 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(200): Illuminate\\Routing\\Router->dispatch(Object(Illuminate\\Http\\Request))
#34 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(144): Illuminate\\Foundation\\Http\\Kernel->Illuminate\\Foundation\\Http\\{closure}(Object(Illuminate\\Http\\Request))
#35 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest.php(21): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#36 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\ConvertEmptyStringsToNull.php(31): Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#37 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\ConvertEmptyStringsToNull->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#38 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest.php(21): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#39 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TrimStrings.php(40): Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#40 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\TrimStrings->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#41 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\ValidatePostSize.php(27): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#42 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\ValidatePostSize->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#43 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\PreventRequestsDuringMaintenance.php(99): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#44 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\PreventRequestsDuringMaintenance->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#45 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Middleware\\HandleCors.php(49): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#46 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Http\\Middleware\\HandleCors->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#47 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Middleware\\TrustProxies.php(39): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#48 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Http\\Middleware\\TrustProxies->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#49 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(119): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#50 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(175): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))
#51 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(144): Illuminate\\Foundation\\Http\\Kernel->sendRequestThroughRouter(Object(Illuminate\\Http\\Request))
#52 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\public\\index.php(51): Illuminate\\Foundation\\Http\\Kernel->handle(Object(Illuminate\\Http\\Request))
#53 {main}
"} 
[2024-03-23 08:18:35] local.ERROR: Undefined property: stdClass::$permennet_village {"view":{"view":"C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\resources\\views\\admin\\owner\\print_sponser.blade.php","data":{"errors":"<pre class=sf-dump id=sf-dump-489851768 data-indent-pad=\"  \"><span class=sf-dump-note>Illuminate\\Support\\ViewErrorBag</span> {<a class=sf-dump-ref>#1313</a><samp data-depth=1 class=sf-dump-expanded>
  #<span class=sf-dump-protected title=\"Protected property\">bags</span>: []
</samp>}
</pre><script>Sfdump(\"sf-dump-489851768\", {\"maxDepth\":3,\"maxStringLength\":160})</script>
","select_owners":"<pre class=sf-dump id=sf-dump-889009977 data-indent-pad=\"  \"><span class=sf-dump-note>Illuminate\\Support\\Collection</span> {<a class=sf-dump-ref>#1336</a><samp data-depth=1 class=sf-dump-expanded>
  #<span class=sf-dump-protected title=\"Protected property\">items</span>: <span class=sf-dump-note>array:1</span> [<samp data-depth=2 class=sf-dump-compact>
    <span class=sf-dump-index>0</span> => {<a class=sf-dump-ref>#1338</a><samp data-depth=3 class=sf-dump-compact>
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">id</span>\": <span class=sf-dump-num>3</span>
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">name</span>\": \"<span class=sf-dump-str title=\"6 characters\">&#1605;&#1740;&#1585;&#1608;&#1740;&#1587;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">last_name</span>\": \"<span class=sf-dump-str title=\"5 characters\">&#1605;&#1608;&#1605;&#1606;&#1583;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">grand_fname</span>\": \"<span class=sf-dump-str title=\"7 characters\">&#1575;&#1581;&#1605;&#1583;&#1588;&#1575;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">Engine_no</span>\": \"<span class=sf-dump-str title=\"6 characters\">123034</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">from_add</span>\": \"<span class=sf-dump-str title=\"9 characters\">&#1670;&#1608;&#1705; &#1578;&#1604;&#1575;&#1588;&#1741;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">to_add</span>\": \"<span class=sf-dump-str title=\"8 characters\">&#1705;&#1575;&#1576;&#1604; &#1607;&#1673;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">direction_number</span>\": <span class=sf-dump-num>100</span>
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">shase_no</span>\": \"<span class=sf-dump-str title=\"5 characters\">30103</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">plate_no</span>\": \"<span class=sf-dump-str title=\"3 characters\">100</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">father_name</span>\": \"<span class=sf-dump-str title=\"9 characters\">&#1593;&#1589;&#1605;&#1578; &#1575;&#1604;&#1604;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">permenant_village</span>\": \"<span class=sf-dump-str title=\"6 characters\">&#1588;&#1576;&#1583;&#1740;&#1575;&#1606;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">current_village</span>\": \"<span class=sf-dump-str title=\"9 characters\">&#1662;&#1575;&#1587; &#1662;&#1594;&#1605;&#1575;&#1606;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">owner_job</span>\": \"<span class=sf-dump-str title=\"5 characters\">&#1673;&#1575;&#1705;&#1660;&#1585;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">nic_number</span>\": \"<span class=sf-dump-str title=\"4 characters\">1400</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">phone_number</span>\": \"<span class=sf-dump-str title=\"10 characters\">0775294943</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">image</span>\": \"<span class=sf-dump-str title=\"24 characters\">masy6h78ng9hpkwrcplq.jpg</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">per_provine_name</span>\": \"<span class=sf-dump-str title=\"7 characters\">&#1606;&#1606;&#1707;&#1585;&#1607;&#1575;&#1585;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">current_pro_name</span>\": \"<span class=sf-dump-str title=\"4 characters\">&#1705;&#1575;&#1576;&#1604;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">per_dist_name</span>\": \"<span class=sf-dump-str title=\"7 characters\">&#1576;&#1660;&#1610; &#1705;&#1608;&#1660;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">current_dist_name</span>\": \"<span class=sf-dump-str title=\"5 characters\">&#1662;&#1594;&#1605;&#1575;&#1606;</span>\"
    </samp>}
  </samp>]
  #<span class=sf-dump-protected title=\"Protected property\">escapeWhenCastingToString</span>: <span class=sf-dump-const>false</span>
</samp>}
</pre><script>Sfdump(\"sf-dump-889009977\", {\"maxDepth\":3,\"maxStringLength\":160})</script>
","get_sponsers":"<pre class=sf-dump id=sf-dump-1871985400 data-indent-pad=\"  \"><span class=sf-dump-note>Illuminate\\Support\\Collection</span> {<a class=sf-dump-ref>#1335</a><samp data-depth=1 class=sf-dump-expanded>
  #<span class=sf-dump-protected title=\"Protected property\">items</span>: <span class=sf-dump-note>array:1</span> [<samp data-depth=2 class=sf-dump-compact>
    <span class=sf-dump-index>0</span> => {<a class=sf-dump-ref>#1342</a><samp data-depth=3 class=sf-dump-compact>
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">owner_code</span>\": <span class=sf-dump-num>3</span>
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">name</span>\": \"<span class=sf-dump-str title=\"6 characters\">&#1605;&#1740;&#1585;&#1608;&#1740;&#1587;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">last_name</span>\": \"<span class=sf-dump-str title=\"5 characters\">&#1605;&#1608;&#1605;&#1606;&#1583;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">father_name</span>\": \"<span class=sf-dump-str title=\"9 characters\">&#1593;&#1589;&#1605;&#1578; &#1575;&#1604;&#1604;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">grand_fname</span>\": \"<span class=sf-dump-str title=\"7 characters\">&#1575;&#1581;&#1605;&#1583;&#1588;&#1575;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">sponser_name</span>\": \"<span class=sf-dump-str title=\"9 characters\">&#1593;&#1589;&#1605;&#1578; &#1575;&#1604;&#1604;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">sponsor_fname</span>\": \"<span class=sf-dump-str title=\"7 characters\">&#1575;&#1581;&#1605;&#1583;&#1588;&#1575;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">per_village</span>\": \"<span class=sf-dump-str title=\"14 characters\">&#1602;&#1604;&#1593;&#1607; &#1580;&#1575;&#1606;&#1575;&#1606; &#1582;&#1575;&#1606;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">cur_village</span>\": \"<span class=sf-dump-str title=\"4 characters\">&#1602;&#1585;&#1594;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">phone_number</span>\": \"<span class=sf-dump-str title=\"11 characters\">07759543534</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">approval_barharli</span>\": \"\"\"
        <span class=sf-dump-str title=\"43 characters\">&#1606;&#1608;&#1605;&#1608;&#1683;&#1610; &#1588;&#1582;&#1589; &#1576;&#1585;&#1581;&#1575;&#1604;&#1610; &#1578;&#1575;&#1740;&#1740;&#1583; &#1583;&#1607;. <span class=\"sf-dump-default sf-dump-ns\">\\r\\n</span></span>
        <span class=sf-dump-str title=\"43 characters\">&#1608;&#1586;&#1575;&#1585;&#1578; &#1605;&#1582;&#1575;&#1576;&#1585;&#1575;&#1578;</span>
        \"\"\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">sponsor_image</span>\": \"<span class=sf-dump-str title=\"24 characters\">ilwdmgyhsozfdbfonpjz.jpg</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">per_provine_name</span>\": \"<span class=sf-dump-str title=\"7 characters\">&#1606;&#1606;&#1707;&#1585;&#1607;&#1575;&#1585;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">current_pro_name</span>\": \"<span class=sf-dump-str title=\"4 characters\">&#1705;&#1575;&#1576;&#1604;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">per_dist_name</span>\": \"<span class=sf-dump-str title=\"4 characters\">&#1705;&#1575;&#1605;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">current_dist_name</span>\": \"<span class=sf-dump-str title=\"5 characters\">&#1662;&#1594;&#1605;&#1575;&#1606;</span>\"
    </samp>}
  </samp>]
  #<span class=sf-dump-protected title=\"Protected property\">escapeWhenCastingToString</span>: <span class=sf-dump-const>false</span>
</samp>}
</pre><script>Sfdump(\"sf-dump-1871985400\", {\"maxDepth\":3,\"maxStringLength\":160})</script>
"}},"userId":4,"exception":"[object] (Spatie\\LaravelIgnition\\Exceptions\\ViewException(code: 0): Undefined property: stdClass::$permennet_village at C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\resources\\views\\admin\\owner\\print_sponser.blade.php:91)
[stacktrace]
#0 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Bootstrap\\HandleExceptions.php(255): Illuminate\\Foundation\\Bootstrap\\HandleExceptions->handleError(2, 'Undefined prope...', 'C:\\\\Users\\\\Abdul ...', 91)
#1 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\resources\\views\\admin\\owner\\print_sponser.blade.php(91): Illuminate\\Foundation\\Bootstrap\\HandleExceptions->Illuminate\\Foundation\\Bootstrap\\{closure}(2, 'Undefined prope...', 'C:\\\\Users\\\\Abdul ...', 91)
#2 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Filesystem\\Filesystem.php(124): require('C:\\\\Users\\\\Abdul ...')
#3 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Filesystem\\Filesystem.php(125): Illuminate\\Filesystem\\Filesystem::Illuminate\\Filesystem\\{closure}()
#4 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\Engines\\PhpEngine.php(58): Illuminate\\Filesystem\\Filesystem->getRequire('C:\\\\Users\\\\Abdul ...', Array)
#5 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\Engines\\CompilerEngine.php(72): Illuminate\\View\\Engines\\PhpEngine->evaluatePath('C:\\\\Users\\\\Abdul ...', Array)
#6 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(207): Illuminate\\View\\Engines\\CompilerEngine->get('C:\\\\Users\\\\Abdul ...', Array)
#7 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(190): Illuminate\\View\\View->getContents()
#8 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(159): Illuminate\\View\\View->renderContents()
#9 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Response.php(69): Illuminate\\View\\View->render()
#10 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Response.php(35): Illuminate\\Http\\Response->setContent(Object(Illuminate\\View\\View))
#11 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(918): Illuminate\\Http\\Response->__construct(Object(Illuminate\\View\\View), 200, Array)
#12 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(885): Illuminate\\Routing\\Router::toResponse(Object(Illuminate\\Http\\Request), Object(Illuminate\\View\\View))
#13 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(805): Illuminate\\Routing\\Router->prepareResponse(Object(Illuminate\\Http\\Request), Object(Illuminate\\View\\View))
#14 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(144): Illuminate\\Routing\\Router->Illuminate\\Routing\\{closure}(Object(Illuminate\\Http\\Request))
#15 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Middleware\\SubstituteBindings.php(50): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#16 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Routing\\Middleware\\SubstituteBindings->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#17 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\VerifyCsrfToken.php(78): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#18 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\VerifyCsrfToken->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#19 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\Middleware\\ShareErrorsFromSession.php(49): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#20 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\View\\Middleware\\ShareErrorsFromSession->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#21 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Middleware\\StartSession.php(121): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#22 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Middleware\\StartSession.php(64): Illuminate\\Session\\Middleware\\StartSession->handleStatefulRequest(Object(Illuminate\\Http\\Request), Object(Illuminate\\Session\\Store), Object(Closure))
#23 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Session\\Middleware\\StartSession->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#24 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Cookie\\Middleware\\AddQueuedCookiesToResponse.php(37): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#25 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Cookie\\Middleware\\AddQueuedCookiesToResponse->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#26 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Cookie\\Middleware\\EncryptCookies.php(67): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#27 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Cookie\\Middleware\\EncryptCookies->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#28 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(119): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#29 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(805): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))
#30 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(784): Illuminate\\Routing\\Router->runRouteWithinStack(Object(Illuminate\\Routing\\Route), Object(Illuminate\\Http\\Request))
#31 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(748): Illuminate\\Routing\\Router->runRoute(Object(Illuminate\\Http\\Request), Object(Illuminate\\Routing\\Route))
#32 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(737): Illuminate\\Routing\\Router->dispatchToRoute(Object(Illuminate\\Http\\Request))
#33 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(200): Illuminate\\Routing\\Router->dispatch(Object(Illuminate\\Http\\Request))
#34 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(144): Illuminate\\Foundation\\Http\\Kernel->Illuminate\\Foundation\\Http\\{closure}(Object(Illuminate\\Http\\Request))
#35 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest.php(21): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#36 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\ConvertEmptyStringsToNull.php(31): Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#37 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\ConvertEmptyStringsToNull->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#38 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest.php(21): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#39 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TrimStrings.php(40): Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#40 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\TrimStrings->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#41 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\ValidatePostSize.php(27): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#42 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\ValidatePostSize->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#43 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\PreventRequestsDuringMaintenance.php(99): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#44 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\PreventRequestsDuringMaintenance->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#45 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Middleware\\HandleCors.php(49): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#46 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Http\\Middleware\\HandleCors->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#47 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Middleware\\TrustProxies.php(39): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#48 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Http\\Middleware\\TrustProxies->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#49 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(119): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#50 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(175): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))
#51 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(144): Illuminate\\Foundation\\Http\\Kernel->sendRequestThroughRouter(Object(Illuminate\\Http\\Request))
#52 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\public\\index.php(51): Illuminate\\Foundation\\Http\\Kernel->handle(Object(Illuminate\\Http\\Request))
#53 {main}

[previous exception] [object] (ErrorException(code: 0): Undefined property: stdClass::$permennet_village at C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\storage\\framework\\views\\f1863c58f54826ce8fd79442db39d1b5.php:91)
[stacktrace]
#0 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Bootstrap\\HandleExceptions.php(255): Illuminate\\Foundation\\Bootstrap\\HandleExceptions->handleError(2, 'Undefined prope...', 'C:\\\\Users\\\\Abdul ...', 91)
#1 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\storage\\framework\\views\\f1863c58f54826ce8fd79442db39d1b5.php(91): Illuminate\\Foundation\\Bootstrap\\HandleExceptions->Illuminate\\Foundation\\Bootstrap\\{closure}(2, 'Undefined prope...', 'C:\\\\Users\\\\Abdul ...', 91)
#2 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Filesystem\\Filesystem.php(124): require('C:\\\\Users\\\\Abdul ...')
#3 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Filesystem\\Filesystem.php(125): Illuminate\\Filesystem\\Filesystem::Illuminate\\Filesystem\\{closure}()
#4 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\Engines\\PhpEngine.php(58): Illuminate\\Filesystem\\Filesystem->getRequire('C:\\\\Users\\\\Abdul ...', Array)
#5 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\Engines\\CompilerEngine.php(72): Illuminate\\View\\Engines\\PhpEngine->evaluatePath('C:\\\\Users\\\\Abdul ...', Array)
#6 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(207): Illuminate\\View\\Engines\\CompilerEngine->get('C:\\\\Users\\\\Abdul ...', Array)
#7 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(190): Illuminate\\View\\View->getContents()
#8 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(159): Illuminate\\View\\View->renderContents()
#9 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Response.php(69): Illuminate\\View\\View->render()
#10 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Response.php(35): Illuminate\\Http\\Response->setContent(Object(Illuminate\\View\\View))
#11 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(918): Illuminate\\Http\\Response->__construct(Object(Illuminate\\View\\View), 200, Array)
#12 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(885): Illuminate\\Routing\\Router::toResponse(Object(Illuminate\\Http\\Request), Object(Illuminate\\View\\View))
#13 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(805): Illuminate\\Routing\\Router->prepareResponse(Object(Illuminate\\Http\\Request), Object(Illuminate\\View\\View))
#14 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(144): Illuminate\\Routing\\Router->Illuminate\\Routing\\{closure}(Object(Illuminate\\Http\\Request))
#15 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Middleware\\SubstituteBindings.php(50): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#16 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Routing\\Middleware\\SubstituteBindings->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#17 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\VerifyCsrfToken.php(78): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#18 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\VerifyCsrfToken->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#19 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\Middleware\\ShareErrorsFromSession.php(49): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#20 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\View\\Middleware\\ShareErrorsFromSession->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#21 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Middleware\\StartSession.php(121): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#22 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Middleware\\StartSession.php(64): Illuminate\\Session\\Middleware\\StartSession->handleStatefulRequest(Object(Illuminate\\Http\\Request), Object(Illuminate\\Session\\Store), Object(Closure))
#23 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Session\\Middleware\\StartSession->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#24 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Cookie\\Middleware\\AddQueuedCookiesToResponse.php(37): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#25 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Cookie\\Middleware\\AddQueuedCookiesToResponse->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#26 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Cookie\\Middleware\\EncryptCookies.php(67): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#27 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Cookie\\Middleware\\EncryptCookies->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#28 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(119): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#29 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(805): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))
#30 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(784): Illuminate\\Routing\\Router->runRouteWithinStack(Object(Illuminate\\Routing\\Route), Object(Illuminate\\Http\\Request))
#31 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(748): Illuminate\\Routing\\Router->runRoute(Object(Illuminate\\Http\\Request), Object(Illuminate\\Routing\\Route))
#32 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(737): Illuminate\\Routing\\Router->dispatchToRoute(Object(Illuminate\\Http\\Request))
#33 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(200): Illuminate\\Routing\\Router->dispatch(Object(Illuminate\\Http\\Request))
#34 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(144): Illuminate\\Foundation\\Http\\Kernel->Illuminate\\Foundation\\Http\\{closure}(Object(Illuminate\\Http\\Request))
#35 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest.php(21): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#36 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\ConvertEmptyStringsToNull.php(31): Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#37 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\ConvertEmptyStringsToNull->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#38 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest.php(21): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#39 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TrimStrings.php(40): Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#40 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\TrimStrings->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#41 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\ValidatePostSize.php(27): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#42 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\ValidatePostSize->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#43 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\PreventRequestsDuringMaintenance.php(99): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#44 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\PreventRequestsDuringMaintenance->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#45 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Middleware\\HandleCors.php(49): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#46 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Http\\Middleware\\HandleCors->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#47 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Middleware\\TrustProxies.php(39): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#48 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Http\\Middleware\\TrustProxies->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#49 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(119): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#50 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(175): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))
#51 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(144): Illuminate\\Foundation\\Http\\Kernel->sendRequestThroughRouter(Object(Illuminate\\Http\\Request))
#52 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\public\\index.php(51): Illuminate\\Foundation\\Http\\Kernel->handle(Object(Illuminate\\Http\\Request))
#53 {main}
"} 
[2024-03-23 08:18:47] local.ERROR: Undefined property: stdClass::$permenent_village {"view":{"view":"C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\resources\\views\\admin\\owner\\print_sponser.blade.php","data":{"errors":"<pre class=sf-dump id=sf-dump-597683948 data-indent-pad=\"  \"><span class=sf-dump-note>Illuminate\\Support\\ViewErrorBag</span> {<a class=sf-dump-ref>#1313</a><samp data-depth=1 class=sf-dump-expanded>
  #<span class=sf-dump-protected title=\"Protected property\">bags</span>: []
</samp>}
</pre><script>Sfdump(\"sf-dump-597683948\", {\"maxDepth\":3,\"maxStringLength\":160})</script>
","select_owners":"<pre class=sf-dump id=sf-dump-60515952 data-indent-pad=\"  \"><span class=sf-dump-note>Illuminate\\Support\\Collection</span> {<a class=sf-dump-ref>#1336</a><samp data-depth=1 class=sf-dump-expanded>
  #<span class=sf-dump-protected title=\"Protected property\">items</span>: <span class=sf-dump-note>array:1</span> [<samp data-depth=2 class=sf-dump-compact>
    <span class=sf-dump-index>0</span> => {<a class=sf-dump-ref>#1338</a><samp data-depth=3 class=sf-dump-compact>
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">id</span>\": <span class=sf-dump-num>3</span>
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">name</span>\": \"<span class=sf-dump-str title=\"6 characters\">&#1605;&#1740;&#1585;&#1608;&#1740;&#1587;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">last_name</span>\": \"<span class=sf-dump-str title=\"5 characters\">&#1605;&#1608;&#1605;&#1606;&#1583;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">grand_fname</span>\": \"<span class=sf-dump-str title=\"7 characters\">&#1575;&#1581;&#1605;&#1583;&#1588;&#1575;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">Engine_no</span>\": \"<span class=sf-dump-str title=\"6 characters\">123034</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">from_add</span>\": \"<span class=sf-dump-str title=\"9 characters\">&#1670;&#1608;&#1705; &#1578;&#1604;&#1575;&#1588;&#1741;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">to_add</span>\": \"<span class=sf-dump-str title=\"8 characters\">&#1705;&#1575;&#1576;&#1604; &#1607;&#1673;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">direction_number</span>\": <span class=sf-dump-num>100</span>
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">shase_no</span>\": \"<span class=sf-dump-str title=\"5 characters\">30103</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">plate_no</span>\": \"<span class=sf-dump-str title=\"3 characters\">100</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">father_name</span>\": \"<span class=sf-dump-str title=\"9 characters\">&#1593;&#1589;&#1605;&#1578; &#1575;&#1604;&#1604;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">permenant_village</span>\": \"<span class=sf-dump-str title=\"6 characters\">&#1588;&#1576;&#1583;&#1740;&#1575;&#1606;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">current_village</span>\": \"<span class=sf-dump-str title=\"9 characters\">&#1662;&#1575;&#1587; &#1662;&#1594;&#1605;&#1575;&#1606;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">owner_job</span>\": \"<span class=sf-dump-str title=\"5 characters\">&#1673;&#1575;&#1705;&#1660;&#1585;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">nic_number</span>\": \"<span class=sf-dump-str title=\"4 characters\">1400</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">phone_number</span>\": \"<span class=sf-dump-str title=\"10 characters\">0775294943</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">image</span>\": \"<span class=sf-dump-str title=\"24 characters\">masy6h78ng9hpkwrcplq.jpg</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">per_provine_name</span>\": \"<span class=sf-dump-str title=\"7 characters\">&#1606;&#1606;&#1707;&#1585;&#1607;&#1575;&#1585;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">current_pro_name</span>\": \"<span class=sf-dump-str title=\"4 characters\">&#1705;&#1575;&#1576;&#1604;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">per_dist_name</span>\": \"<span class=sf-dump-str title=\"7 characters\">&#1576;&#1660;&#1610; &#1705;&#1608;&#1660;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">current_dist_name</span>\": \"<span class=sf-dump-str title=\"5 characters\">&#1662;&#1594;&#1605;&#1575;&#1606;</span>\"
    </samp>}
  </samp>]
  #<span class=sf-dump-protected title=\"Protected property\">escapeWhenCastingToString</span>: <span class=sf-dump-const>false</span>
</samp>}
</pre><script>Sfdump(\"sf-dump-60515952\", {\"maxDepth\":3,\"maxStringLength\":160})</script>
","get_sponsers":"<pre class=sf-dump id=sf-dump-315479833 data-indent-pad=\"  \"><span class=sf-dump-note>Illuminate\\Support\\Collection</span> {<a class=sf-dump-ref>#1335</a><samp data-depth=1 class=sf-dump-expanded>
  #<span class=sf-dump-protected title=\"Protected property\">items</span>: <span class=sf-dump-note>array:1</span> [<samp data-depth=2 class=sf-dump-compact>
    <span class=sf-dump-index>0</span> => {<a class=sf-dump-ref>#1342</a><samp data-depth=3 class=sf-dump-compact>
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">owner_code</span>\": <span class=sf-dump-num>3</span>
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">name</span>\": \"<span class=sf-dump-str title=\"6 characters\">&#1605;&#1740;&#1585;&#1608;&#1740;&#1587;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">last_name</span>\": \"<span class=sf-dump-str title=\"5 characters\">&#1605;&#1608;&#1605;&#1606;&#1583;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">father_name</span>\": \"<span class=sf-dump-str title=\"9 characters\">&#1593;&#1589;&#1605;&#1578; &#1575;&#1604;&#1604;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">grand_fname</span>\": \"<span class=sf-dump-str title=\"7 characters\">&#1575;&#1581;&#1605;&#1583;&#1588;&#1575;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">sponser_name</span>\": \"<span class=sf-dump-str title=\"9 characters\">&#1593;&#1589;&#1605;&#1578; &#1575;&#1604;&#1604;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">sponsor_fname</span>\": \"<span class=sf-dump-str title=\"7 characters\">&#1575;&#1581;&#1605;&#1583;&#1588;&#1575;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">per_village</span>\": \"<span class=sf-dump-str title=\"14 characters\">&#1602;&#1604;&#1593;&#1607; &#1580;&#1575;&#1606;&#1575;&#1606; &#1582;&#1575;&#1606;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">cur_village</span>\": \"<span class=sf-dump-str title=\"4 characters\">&#1602;&#1585;&#1594;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">phone_number</span>\": \"<span class=sf-dump-str title=\"11 characters\">07759543534</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">approval_barharli</span>\": \"\"\"
        <span class=sf-dump-str title=\"43 characters\">&#1606;&#1608;&#1605;&#1608;&#1683;&#1610; &#1588;&#1582;&#1589; &#1576;&#1585;&#1581;&#1575;&#1604;&#1610; &#1578;&#1575;&#1740;&#1740;&#1583; &#1583;&#1607;. <span class=\"sf-dump-default sf-dump-ns\">\\r\\n</span></span>
        <span class=sf-dump-str title=\"43 characters\">&#1608;&#1586;&#1575;&#1585;&#1578; &#1605;&#1582;&#1575;&#1576;&#1585;&#1575;&#1578;</span>
        \"\"\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">sponsor_image</span>\": \"<span class=sf-dump-str title=\"24 characters\">ilwdmgyhsozfdbfonpjz.jpg</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">per_provine_name</span>\": \"<span class=sf-dump-str title=\"7 characters\">&#1606;&#1606;&#1707;&#1585;&#1607;&#1575;&#1585;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">current_pro_name</span>\": \"<span class=sf-dump-str title=\"4 characters\">&#1705;&#1575;&#1576;&#1604;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">per_dist_name</span>\": \"<span class=sf-dump-str title=\"4 characters\">&#1705;&#1575;&#1605;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">current_dist_name</span>\": \"<span class=sf-dump-str title=\"5 characters\">&#1662;&#1594;&#1605;&#1575;&#1606;</span>\"
    </samp>}
  </samp>]
  #<span class=sf-dump-protected title=\"Protected property\">escapeWhenCastingToString</span>: <span class=sf-dump-const>false</span>
</samp>}
</pre><script>Sfdump(\"sf-dump-315479833\", {\"maxDepth\":3,\"maxStringLength\":160})</script>
"}},"userId":4,"exception":"[object] (Spatie\\LaravelIgnition\\Exceptions\\ViewException(code: 0): Undefined property: stdClass::$permenent_village at C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\resources\\views\\admin\\owner\\print_sponser.blade.php:91)
[stacktrace]
#0 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Bootstrap\\HandleExceptions.php(255): Illuminate\\Foundation\\Bootstrap\\HandleExceptions->handleError(2, 'Undefined prope...', 'C:\\\\Users\\\\Abdul ...', 91)
#1 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\resources\\views\\admin\\owner\\print_sponser.blade.php(91): Illuminate\\Foundation\\Bootstrap\\HandleExceptions->Illuminate\\Foundation\\Bootstrap\\{closure}(2, 'Undefined prope...', 'C:\\\\Users\\\\Abdul ...', 91)
#2 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Filesystem\\Filesystem.php(124): require('C:\\\\Users\\\\Abdul ...')
#3 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Filesystem\\Filesystem.php(125): Illuminate\\Filesystem\\Filesystem::Illuminate\\Filesystem\\{closure}()
#4 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\Engines\\PhpEngine.php(58): Illuminate\\Filesystem\\Filesystem->getRequire('C:\\\\Users\\\\Abdul ...', Array)
#5 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\Engines\\CompilerEngine.php(72): Illuminate\\View\\Engines\\PhpEngine->evaluatePath('C:\\\\Users\\\\Abdul ...', Array)
#6 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(207): Illuminate\\View\\Engines\\CompilerEngine->get('C:\\\\Users\\\\Abdul ...', Array)
#7 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(190): Illuminate\\View\\View->getContents()
#8 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(159): Illuminate\\View\\View->renderContents()
#9 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Response.php(69): Illuminate\\View\\View->render()
#10 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Response.php(35): Illuminate\\Http\\Response->setContent(Object(Illuminate\\View\\View))
#11 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(918): Illuminate\\Http\\Response->__construct(Object(Illuminate\\View\\View), 200, Array)
#12 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(885): Illuminate\\Routing\\Router::toResponse(Object(Illuminate\\Http\\Request), Object(Illuminate\\View\\View))
#13 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(805): Illuminate\\Routing\\Router->prepareResponse(Object(Illuminate\\Http\\Request), Object(Illuminate\\View\\View))
#14 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(144): Illuminate\\Routing\\Router->Illuminate\\Routing\\{closure}(Object(Illuminate\\Http\\Request))
#15 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Middleware\\SubstituteBindings.php(50): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#16 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Routing\\Middleware\\SubstituteBindings->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#17 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\VerifyCsrfToken.php(78): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#18 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\VerifyCsrfToken->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#19 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\Middleware\\ShareErrorsFromSession.php(49): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#20 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\View\\Middleware\\ShareErrorsFromSession->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#21 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Middleware\\StartSession.php(121): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#22 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Middleware\\StartSession.php(64): Illuminate\\Session\\Middleware\\StartSession->handleStatefulRequest(Object(Illuminate\\Http\\Request), Object(Illuminate\\Session\\Store), Object(Closure))
#23 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Session\\Middleware\\StartSession->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#24 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Cookie\\Middleware\\AddQueuedCookiesToResponse.php(37): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#25 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Cookie\\Middleware\\AddQueuedCookiesToResponse->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#26 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Cookie\\Middleware\\EncryptCookies.php(67): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#27 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Cookie\\Middleware\\EncryptCookies->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#28 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(119): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#29 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(805): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))
#30 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(784): Illuminate\\Routing\\Router->runRouteWithinStack(Object(Illuminate\\Routing\\Route), Object(Illuminate\\Http\\Request))
#31 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(748): Illuminate\\Routing\\Router->runRoute(Object(Illuminate\\Http\\Request), Object(Illuminate\\Routing\\Route))
#32 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(737): Illuminate\\Routing\\Router->dispatchToRoute(Object(Illuminate\\Http\\Request))
#33 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(200): Illuminate\\Routing\\Router->dispatch(Object(Illuminate\\Http\\Request))
#34 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(144): Illuminate\\Foundation\\Http\\Kernel->Illuminate\\Foundation\\Http\\{closure}(Object(Illuminate\\Http\\Request))
#35 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest.php(21): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#36 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\ConvertEmptyStringsToNull.php(31): Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#37 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\ConvertEmptyStringsToNull->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#38 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest.php(21): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#39 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TrimStrings.php(40): Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#40 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\TrimStrings->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#41 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\ValidatePostSize.php(27): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#42 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\ValidatePostSize->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#43 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\PreventRequestsDuringMaintenance.php(99): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#44 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\PreventRequestsDuringMaintenance->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#45 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Middleware\\HandleCors.php(49): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#46 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Http\\Middleware\\HandleCors->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#47 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Middleware\\TrustProxies.php(39): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#48 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Http\\Middleware\\TrustProxies->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#49 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(119): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#50 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(175): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))
#51 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(144): Illuminate\\Foundation\\Http\\Kernel->sendRequestThroughRouter(Object(Illuminate\\Http\\Request))
#52 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\public\\index.php(51): Illuminate\\Foundation\\Http\\Kernel->handle(Object(Illuminate\\Http\\Request))
#53 {main}

[previous exception] [object] (ErrorException(code: 0): Undefined property: stdClass::$permenent_village at C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\storage\\framework\\views\\f1863c58f54826ce8fd79442db39d1b5.php:91)
[stacktrace]
#0 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Bootstrap\\HandleExceptions.php(255): Illuminate\\Foundation\\Bootstrap\\HandleExceptions->handleError(2, 'Undefined prope...', 'C:\\\\Users\\\\Abdul ...', 91)
#1 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\storage\\framework\\views\\f1863c58f54826ce8fd79442db39d1b5.php(91): Illuminate\\Foundation\\Bootstrap\\HandleExceptions->Illuminate\\Foundation\\Bootstrap\\{closure}(2, 'Undefined prope...', 'C:\\\\Users\\\\Abdul ...', 91)
#2 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Filesystem\\Filesystem.php(124): require('C:\\\\Users\\\\Abdul ...')
#3 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Filesystem\\Filesystem.php(125): Illuminate\\Filesystem\\Filesystem::Illuminate\\Filesystem\\{closure}()
#4 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\Engines\\PhpEngine.php(58): Illuminate\\Filesystem\\Filesystem->getRequire('C:\\\\Users\\\\Abdul ...', Array)
#5 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\Engines\\CompilerEngine.php(72): Illuminate\\View\\Engines\\PhpEngine->evaluatePath('C:\\\\Users\\\\Abdul ...', Array)
#6 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(207): Illuminate\\View\\Engines\\CompilerEngine->get('C:\\\\Users\\\\Abdul ...', Array)
#7 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(190): Illuminate\\View\\View->getContents()
#8 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(159): Illuminate\\View\\View->renderContents()
#9 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Response.php(69): Illuminate\\View\\View->render()
#10 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Response.php(35): Illuminate\\Http\\Response->setContent(Object(Illuminate\\View\\View))
#11 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(918): Illuminate\\Http\\Response->__construct(Object(Illuminate\\View\\View), 200, Array)
#12 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(885): Illuminate\\Routing\\Router::toResponse(Object(Illuminate\\Http\\Request), Object(Illuminate\\View\\View))
#13 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(805): Illuminate\\Routing\\Router->prepareResponse(Object(Illuminate\\Http\\Request), Object(Illuminate\\View\\View))
#14 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(144): Illuminate\\Routing\\Router->Illuminate\\Routing\\{closure}(Object(Illuminate\\Http\\Request))
#15 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Middleware\\SubstituteBindings.php(50): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#16 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Routing\\Middleware\\SubstituteBindings->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#17 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\VerifyCsrfToken.php(78): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#18 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\VerifyCsrfToken->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#19 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\Middleware\\ShareErrorsFromSession.php(49): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#20 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\View\\Middleware\\ShareErrorsFromSession->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#21 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Middleware\\StartSession.php(121): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#22 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Middleware\\StartSession.php(64): Illuminate\\Session\\Middleware\\StartSession->handleStatefulRequest(Object(Illuminate\\Http\\Request), Object(Illuminate\\Session\\Store), Object(Closure))
#23 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Session\\Middleware\\StartSession->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#24 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Cookie\\Middleware\\AddQueuedCookiesToResponse.php(37): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#25 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Cookie\\Middleware\\AddQueuedCookiesToResponse->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#26 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Cookie\\Middleware\\EncryptCookies.php(67): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#27 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Cookie\\Middleware\\EncryptCookies->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#28 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(119): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#29 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(805): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))
#30 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(784): Illuminate\\Routing\\Router->runRouteWithinStack(Object(Illuminate\\Routing\\Route), Object(Illuminate\\Http\\Request))
#31 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(748): Illuminate\\Routing\\Router->runRoute(Object(Illuminate\\Http\\Request), Object(Illuminate\\Routing\\Route))
#32 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(737): Illuminate\\Routing\\Router->dispatchToRoute(Object(Illuminate\\Http\\Request))
#33 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(200): Illuminate\\Routing\\Router->dispatch(Object(Illuminate\\Http\\Request))
#34 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(144): Illuminate\\Foundation\\Http\\Kernel->Illuminate\\Foundation\\Http\\{closure}(Object(Illuminate\\Http\\Request))
#35 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest.php(21): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#36 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\ConvertEmptyStringsToNull.php(31): Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#37 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\ConvertEmptyStringsToNull->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#38 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest.php(21): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#39 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TrimStrings.php(40): Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#40 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\TrimStrings->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#41 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\ValidatePostSize.php(27): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#42 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\ValidatePostSize->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#43 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\PreventRequestsDuringMaintenance.php(99): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#44 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\PreventRequestsDuringMaintenance->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#45 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Middleware\\HandleCors.php(49): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#46 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Http\\Middleware\\HandleCors->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#47 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Middleware\\TrustProxies.php(39): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#48 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Http\\Middleware\\TrustProxies->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#49 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(119): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#50 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(175): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))
#51 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(144): Illuminate\\Foundation\\Http\\Kernel->sendRequestThroughRouter(Object(Illuminate\\Http\\Request))
#52 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\public\\index.php(51): Illuminate\\Foundation\\Http\\Kernel->handle(Object(Illuminate\\Http\\Request))
#53 {main}
"} 
[2024-03-23 08:52:03] local.ERROR: Undefined property: stdClass::$current_village {"view":{"view":"C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\resources\\views\\admin\\owner\\print_sponser.blade.php","data":{"errors":"<pre class=sf-dump id=sf-dump-1441971957 data-indent-pad=\"  \"><span class=sf-dump-note>Illuminate\\Support\\ViewErrorBag</span> {<a class=sf-dump-ref>#1313</a><samp data-depth=1 class=sf-dump-expanded>
  #<span class=sf-dump-protected title=\"Protected property\">bags</span>: []
</samp>}
</pre><script>Sfdump(\"sf-dump-1441971957\", {\"maxDepth\":3,\"maxStringLength\":160})</script>
","select_owners":"<pre class=sf-dump id=sf-dump-697168302 data-indent-pad=\"  \"><span class=sf-dump-note>Illuminate\\Support\\Collection</span> {<a class=sf-dump-ref>#1336</a><samp data-depth=1 class=sf-dump-expanded>
  #<span class=sf-dump-protected title=\"Protected property\">items</span>: <span class=sf-dump-note>array:1</span> [<samp data-depth=2 class=sf-dump-compact>
    <span class=sf-dump-index>0</span> => {<a class=sf-dump-ref>#1338</a><samp data-depth=3 class=sf-dump-compact>
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">id</span>\": <span class=sf-dump-num>3</span>
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">name</span>\": \"<span class=sf-dump-str title=\"6 characters\">&#1605;&#1740;&#1585;&#1608;&#1740;&#1587;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">last_name</span>\": \"<span class=sf-dump-str title=\"5 characters\">&#1605;&#1608;&#1605;&#1606;&#1583;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">grand_fname</span>\": \"<span class=sf-dump-str title=\"7 characters\">&#1575;&#1581;&#1605;&#1583;&#1588;&#1575;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">Engine_no</span>\": \"<span class=sf-dump-str title=\"6 characters\">123034</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">from_add</span>\": \"<span class=sf-dump-str title=\"9 characters\">&#1670;&#1608;&#1705; &#1578;&#1604;&#1575;&#1588;&#1741;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">to_add</span>\": \"<span class=sf-dump-str title=\"8 characters\">&#1705;&#1575;&#1576;&#1604; &#1607;&#1673;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">direction_number</span>\": <span class=sf-dump-num>100</span>
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">shase_no</span>\": \"<span class=sf-dump-str title=\"5 characters\">30103</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">plate_no</span>\": \"<span class=sf-dump-str title=\"3 characters\">100</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">father_name</span>\": \"<span class=sf-dump-str title=\"9 characters\">&#1593;&#1589;&#1605;&#1578; &#1575;&#1604;&#1604;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">permenant_village</span>\": \"<span class=sf-dump-str title=\"6 characters\">&#1588;&#1576;&#1583;&#1740;&#1575;&#1606;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">current_village</span>\": \"<span class=sf-dump-str title=\"9 characters\">&#1662;&#1575;&#1587; &#1662;&#1594;&#1605;&#1575;&#1606;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">owner_job</span>\": \"<span class=sf-dump-str title=\"5 characters\">&#1673;&#1575;&#1705;&#1660;&#1585;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">nic_number</span>\": \"<span class=sf-dump-str title=\"4 characters\">1400</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">phone_number</span>\": \"<span class=sf-dump-str title=\"10 characters\">0775294943</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">image</span>\": \"<span class=sf-dump-str title=\"24 characters\">masy6h78ng9hpkwrcplq.jpg</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">per_provine_name</span>\": \"<span class=sf-dump-str title=\"7 characters\">&#1606;&#1606;&#1707;&#1585;&#1607;&#1575;&#1585;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">current_pro_name</span>\": \"<span class=sf-dump-str title=\"4 characters\">&#1705;&#1575;&#1576;&#1604;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">per_dist_name</span>\": \"<span class=sf-dump-str title=\"7 characters\">&#1576;&#1660;&#1610; &#1705;&#1608;&#1660;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">current_dist_name</span>\": \"<span class=sf-dump-str title=\"5 characters\">&#1662;&#1594;&#1605;&#1575;&#1606;</span>\"
    </samp>}
  </samp>]
  #<span class=sf-dump-protected title=\"Protected property\">escapeWhenCastingToString</span>: <span class=sf-dump-const>false</span>
</samp>}
</pre><script>Sfdump(\"sf-dump-697168302\", {\"maxDepth\":3,\"maxStringLength\":160})</script>
","get_sponsers":"<pre class=sf-dump id=sf-dump-1928305249 data-indent-pad=\"  \"><span class=sf-dump-note>Illuminate\\Support\\Collection</span> {<a class=sf-dump-ref>#1335</a><samp data-depth=1 class=sf-dump-expanded>
  #<span class=sf-dump-protected title=\"Protected property\">items</span>: <span class=sf-dump-note>array:1</span> [<samp data-depth=2 class=sf-dump-compact>
    <span class=sf-dump-index>0</span> => {<a class=sf-dump-ref>#1342</a><samp data-depth=3 class=sf-dump-compact>
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">owner_code</span>\": <span class=sf-dump-num>3</span>
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">name</span>\": \"<span class=sf-dump-str title=\"6 characters\">&#1605;&#1740;&#1585;&#1608;&#1740;&#1587;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">last_name</span>\": \"<span class=sf-dump-str title=\"5 characters\">&#1605;&#1608;&#1605;&#1606;&#1583;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">father_name</span>\": \"<span class=sf-dump-str title=\"9 characters\">&#1593;&#1589;&#1605;&#1578; &#1575;&#1604;&#1604;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">grand_fname</span>\": \"<span class=sf-dump-str title=\"7 characters\">&#1575;&#1581;&#1605;&#1583;&#1588;&#1575;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">sponser_name</span>\": \"<span class=sf-dump-str title=\"9 characters\">&#1593;&#1589;&#1605;&#1578; &#1575;&#1604;&#1604;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">sponsor_fname</span>\": \"<span class=sf-dump-str title=\"7 characters\">&#1575;&#1581;&#1605;&#1583;&#1588;&#1575;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">per_village</span>\": \"<span class=sf-dump-str title=\"14 characters\">&#1602;&#1604;&#1593;&#1607; &#1580;&#1575;&#1606;&#1575;&#1606; &#1582;&#1575;&#1606;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">cur_village</span>\": \"<span class=sf-dump-str title=\"4 characters\">&#1602;&#1585;&#1594;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">phone_number</span>\": \"<span class=sf-dump-str title=\"11 characters\">07759543534</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">approval_barharli</span>\": \"\"\"
        <span class=sf-dump-str title=\"43 characters\">&#1606;&#1608;&#1605;&#1608;&#1683;&#1610; &#1588;&#1582;&#1589; &#1576;&#1585;&#1581;&#1575;&#1604;&#1610; &#1578;&#1575;&#1740;&#1740;&#1583; &#1583;&#1607;. <span class=\"sf-dump-default sf-dump-ns\">\\r\\n</span></span>
        <span class=sf-dump-str title=\"43 characters\">&#1608;&#1586;&#1575;&#1585;&#1578; &#1605;&#1582;&#1575;&#1576;&#1585;&#1575;&#1578;</span>
        \"\"\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">sponsor_image</span>\": \"<span class=sf-dump-str title=\"24 characters\">ilwdmgyhsozfdbfonpjz.jpg</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">per_provine_name</span>\": \"<span class=sf-dump-str title=\"7 characters\">&#1606;&#1606;&#1707;&#1585;&#1607;&#1575;&#1585;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">current_pro_name</span>\": \"<span class=sf-dump-str title=\"4 characters\">&#1705;&#1575;&#1576;&#1604;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">per_dist_name</span>\": \"<span class=sf-dump-str title=\"4 characters\">&#1705;&#1575;&#1605;&#1607;</span>\"
      +\"<span class=sf-dump-public title=\"Runtime added dynamic property\">current_dist_name</span>\": \"<span class=sf-dump-str title=\"5 characters\">&#1662;&#1594;&#1605;&#1575;&#1606;</span>\"
    </samp>}
  </samp>]
  #<span class=sf-dump-protected title=\"Protected property\">escapeWhenCastingToString</span>: <span class=sf-dump-const>false</span>
</samp>}
</pre><script>Sfdump(\"sf-dump-1928305249\", {\"maxDepth\":3,\"maxStringLength\":160})</script>
"}},"userId":4,"exception":"[object] (Spatie\\LaravelIgnition\\Exceptions\\ViewException(code: 0): Undefined property: stdClass::$current_village at C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\resources\\views\\admin\\owner\\print_sponser.blade.php:141)
[stacktrace]
#0 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Bootstrap\\HandleExceptions.php(255): Illuminate\\Foundation\\Bootstrap\\HandleExceptions->handleError(2, 'Undefined prope...', 'C:\\\\Users\\\\Abdul ...', 141)
#1 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\resources\\views\\admin\\owner\\print_sponser.blade.php(141): Illuminate\\Foundation\\Bootstrap\\HandleExceptions->Illuminate\\Foundation\\Bootstrap\\{closure}(2, 'Undefined prope...', 'C:\\\\Users\\\\Abdul ...', 141)
#2 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Filesystem\\Filesystem.php(124): require('C:\\\\Users\\\\Abdul ...')
#3 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Filesystem\\Filesystem.php(125): Illuminate\\Filesystem\\Filesystem::Illuminate\\Filesystem\\{closure}()
#4 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\Engines\\PhpEngine.php(58): Illuminate\\Filesystem\\Filesystem->getRequire('C:\\\\Users\\\\Abdul ...', Array)
#5 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\Engines\\CompilerEngine.php(72): Illuminate\\View\\Engines\\PhpEngine->evaluatePath('C:\\\\Users\\\\Abdul ...', Array)
#6 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(207): Illuminate\\View\\Engines\\CompilerEngine->get('C:\\\\Users\\\\Abdul ...', Array)
#7 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(190): Illuminate\\View\\View->getContents()
#8 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(159): Illuminate\\View\\View->renderContents()
#9 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Response.php(69): Illuminate\\View\\View->render()
#10 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Response.php(35): Illuminate\\Http\\Response->setContent(Object(Illuminate\\View\\View))
#11 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(918): Illuminate\\Http\\Response->__construct(Object(Illuminate\\View\\View), 200, Array)
#12 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(885): Illuminate\\Routing\\Router::toResponse(Object(Illuminate\\Http\\Request), Object(Illuminate\\View\\View))
#13 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(805): Illuminate\\Routing\\Router->prepareResponse(Object(Illuminate\\Http\\Request), Object(Illuminate\\View\\View))
#14 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(144): Illuminate\\Routing\\Router->Illuminate\\Routing\\{closure}(Object(Illuminate\\Http\\Request))
#15 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Middleware\\SubstituteBindings.php(50): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#16 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Routing\\Middleware\\SubstituteBindings->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#17 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\VerifyCsrfToken.php(78): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#18 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\VerifyCsrfToken->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#19 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\View\\Middleware\\ShareErrorsFromSession.php(49): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#20 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\View\\Middleware\\ShareErrorsFromSession->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#21 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Middleware\\StartSession.php(121): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#22 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Middleware\\StartSession.php(64): Illuminate\\Session\\Middleware\\StartSession->handleStatefulRequest(Object(Illuminate\\Http\\Request), Object(Illuminate\\Session\\Store), Object(Closure))
#23 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Session\\Middleware\\StartSession->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#24 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Cookie\\Middleware\\AddQueuedCookiesToResponse.php(37): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#25 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Cookie\\Middleware\\AddQueuedCookiesToResponse->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#26 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Cookie\\Middleware\\EncryptCookies.php(67): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#27 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Cookie\\Middleware\\EncryptCookies->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#28 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(119): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#29 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(805): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))
#30 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(784): Illuminate\\Routing\\Router->runRouteWithinStack(Object(Illuminate\\Routing\\Route), Object(Illuminate\\Http\\Request))
#31 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(748): Illuminate\\Routing\\Router->runRoute(Object(Illuminate\\Http\\Request), Object(Illuminate\\Routing\\Route))
#32 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(737): Illuminate\\Routing\\Router->dispatchToRoute(Object(Illuminate\\Http\\Request))
#33 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(200): Illuminate\\Routing\\Router->dispatch(Object(Illuminate\\Http\\Request))
#34 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(144): Illuminate\\Foundation\\Http\\Kernel->Illuminate\\Foundation\\Http\\{closure}(Object(Illuminate\\Http\\Request))
#35 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest.php(21): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#36 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\ConvertEmptyStringsToNull.php(31): Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#37 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(183): Illuminate\\Foundation\\Http\\Middleware\\ConvertEmptyStringsToNull->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#38 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest.php(21): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#39 C:\\Users\\Abdul Basir Momand\\Desktop\\baba_company\\vendor\\laravel