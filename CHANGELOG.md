# Changelog

## 0.2.2 (15 Dec 2017)

* Basic support for request headers

## 0.2.1 (11 Dec 2017)

* Make contract files more human-readable
* Added query param support

## 0.2.0 (03 Dec 2017)

* Can specify a request body for non-GET interactions
* **BREAKING**: Contracts are now expressed in Hobbes notation using `is`
 * `is(value)` represents an exact value which must be returned by the provider
 * `is.string(value)` represents any string value
 * `is.number(value)` represents any numeric value
 * `is.boolean(value)` represents any boolean value
 * `is.object(fields)` represents an object with the given fields
 * `is.arrayOf(schema)` represents an array of the given schema
* Verifier reports more specific errors

## 0.1.1 (28 Oct 2017)

* Verifier now checks for matching response status and body

## 0.1.0 (28 Oct 2017)

* Initial release