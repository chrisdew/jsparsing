// jsParsing

// create a function on Object to allow easy inheritance
if (typeof Object.beget !== 'function') {
    Object.beget = function (o) {
        var F = function () {};
        F.prototype = o;
        return new F()
    };
}

// This is the prototype for the results returned from Parsers.
var Result = {
    success : false;
    input : '';
    matched : '';
    remaining : '';
    message : '';
} 

var Parser = {
    parse : function(input) {
        alert('Parser.parse not implemented.')
    };
}

var Literal = Object.beget(Parser);
var Literal.parse = function(input) {
    alert('Literal.parse not implemented.')
}


/*************************************************************
* This Python code is the starting point for jsParsing.      *
* It can be found at http://pypi.python.org/pypi/completion/ *
*************************************************************/
/*
#!/usr/bin/python
"""
Completion is a module for performing autocompletion of text according to a 
programatically expressed grammar.

If you don't get any of that ;-) have a look at the doctests below...

>>> foo = Literal('foo')
>>> print foo.parse('f')
ParseResult(False, input=None, completions=['oo'], message=None)

>>> foo = Literal('foo')
>>> print foo.parse('ba')
ParseResult(False, input=None, completions=[], message=None)

>>> foobar = Literal('foobar')
>>> food = Literal('food')
>>> foobar_or_food = Or(foobar, food)
>>> print foobar_or_food.parse('f')
ParseResult(False, input=None, completions=['oobar', 'ood'], message=None)
>>> print foobar_or_food.parse('g')
ParseResult(False, input=None, completions=[], message=None)
>>> print foobar_or_food.parse('food')
ParseResult(True, input=, completions=[], message=None)
>>> print foobar_or_food.parse('foo')
ParseResult(False, input=None, completions=['bar', 'd'], message=None)

>>> foobar_then_food = Then(foobar, WhiteSpace(), food)
>>> print foobar_then_food.parse('fo')
ParseResult(False, input=None, completions=['obar'], message=None)
>>> print foobar_then_food.parse('')
ParseResult(False, input=None, completions=['foobar'], message=None)
>>> print foobar_then_food.parse('foobar f')
ParseResult(False, input=None, completions=['ood'], message=None)
>>> print foobar_then_food.parse('foobar')
ParseResult(False, input=, completions=[' ', '\\t'], message=None)

>>> optional_foo = Occurances(foo, min=0, max=1)
>>> optional_foo.parse("")
ParseResult(True, input=None, completions=[], message=None)
>>> optional_foo.parse("fo")
ParseResult(True, input=None, completions=[], message=None)

>>> three_or_four_foos = Occurances(foo, min=3, max=4)
>>> three_or_four_foos.parse("")
ParseResult(False, input=None, completions=['foo'], message=None)
>>> three_or_four_foos.parse("foof")
ParseResult(False, input=None, completions=['oo'], message=None)

>>> name = Alphas()
>>> name.parse("")
ParseResult(False, input=, completions=['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'], message=None)
>>> name.parse("abc")
ParseResult(True, input=, completions=['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'], message=None)

>>> bar = Literal('bar')
>>> complex = Then(name, WhiteSpace(), bar)
>>> complex.parse('f')
ParseResult(False, input=, completions=['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', ' ', '\\t'], message=None)
>>> complex = Or(Or(foo, food, foobar), Then(name, WhiteSpace(), bar))
>>> complex.parse('f')
ParseResult(False, input=None, completions=['oo', 'ood', 'oobar', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', ' ', '\\t'], message=None)

"""

import sys

class ParseResult:
    def __init__(self, success, input=None, completions=[], message=None):
        self.success = success
        self.input = input
        self.completions = completions
        self.message = message

    def __repr__(self):
        return "ParseResult(%s, input=%s, completions=%s, message=%s)" % (
            str(self.success),
            str(self.input),
            str(self.completions),
            str(self.message),
        )

class Parser:
    def parse(self, input):
        pass

class Literal(Parser):
    def __init__(self, text):
        self.text = text

    def parse(self, input):
        if input.startswith(self.text):
            return ParseResult(True, input[len(self.text):])
        # if the input isn't at the beginning of self.text, then this 
        # cannot be autocompleted
        if not self.text.startswith(input):
            return ParseResult(False)
        return ParseResult(False, completions=[self.text[len(input):]])

class Occurances(Parser):
    def __init__(self, parser, min=0, max=1):
        self.parser = parser
        if min < 0:
            raise Exception("Min must not be negative.")
        if max < min:
            raise Exception("Max must not be less than min.")
        if max < 1:
            raise Exception("Max must be more than zero.")
        self.min = min
        self.max = max
   
    def parse(self, input):
        # see how many times parser can be applied, up to max
        for i in range(self.max):
            parse_result = self.parser.parse(input)
            input = parse_result.input
            if not parse_result.success:
                break
        #print i, self.min
        if i < self.min and self.min > 0:
            return parse_result
        return ParseResult(True, input)


class Chars(Parser):
    def __init__(self, chars):
        self.chars = chars

    def parse(self, input):
        if len(input) == 0:
            return ParseResult(False, input, list(self.chars))
        if input[0] not in self.chars:
            return ParseResult(False, input)
        while len(input) > 0 and input[0] in self.chars:
            input = input[1:]
        if len(input) == 0:
            return ParseResult(True, input, list(self.chars))
        return ParseResult(True, input)

class WhiteSpace(Chars):
    def __init__(self):
        self.chars = ' \t'

class Alphas(Chars):
    def __init__(self):
        self.chars = 'abcdefghijklmnopqrstuvwxyz'

class Alphanums(Chars):
    def __init__(self):
        self.chars = 'abcdefghijklmnopqrstuvwxyz0123456789'

class Then(Parser):
    def __init__(self, *parsers):
        self.parsers = parsers

    def parse(self, input):
        # try all the parsers in order, until one fails
        completions = []
        for parser in self.parsers:
            parse_result = parser.parse(input)
            completions += parse_result.completions
            if not parse_result.success:
                # add the completions for successful parsings which can take more
                parse_result.completions = completions
                return parse_result
            input = parse_result.input
        return ParseResult(True, input)

class Or(Parser):
    def __init__(self, *parsers):
        self.parsers = parsers

    def parse(self, input):
        # try all the parsers and see whether any work
        parse_results = map(lambda x: x.parse(input), self.parsers)
        
        # were any successful?
        successful_result = None
        completions = []
        for parse_result in parse_results:
            if parse_result.success and not successful_result:
                # first matched
                successful_result = parse_result
            completions += parse_result.completions

        if successful_result:
            return successful_result

        # otherwise return all the completions
        return ParseResult(False, None, completions) 



def _test():
    """Test with doctest."""
    import doctest
    doctest.testmod()


if __name__ == "__main__":
    _test()
*/
