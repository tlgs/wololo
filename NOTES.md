# Notes

Assorted notes taken during development.

1. [GitHub Actions](#GitHub-Actions)
2. [JavaScript](#JavaScript)
3. [Bash scripting](#Bash-scripting)
4. [Other](#Other)

## GitHub Actions

There is currently no way to anonymously access job artifacts.

This would be my prefered solution for the _storage location_ of the histogram data.
Had to settle with the bot-commits-to-repo method.

See:

- <https://docs.github.com/en/free-pro-team@latest/rest/reference/actions#artifacts>
- <https://github.community/t/public-read-access-to-actions-artifacts/17363>

---

Regarding `commit/push` from GitHub Actions, see:

- <https://stackoverflow.com/q/57921401>
- <https://lannonbr.com/blog/2019-12-09-git-commit-in-actions>

---

If a script is not set as executable, you will get a `Permission denied` error.
On Windows, run:

```console
git update-index --chmod=+x script
```

## JavaScript

Apparently, [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
are the most appropriate way to concatenate strings.
They remind me of Python's `f-strings`.

```JavaScript
>> let x = 'Hello';
>> let y = 'World';
>> console.log(`${x}, ${y}!`);
Hello, World!
```

---

Using `Array.reduce` to calculate `cumsum`:

```JavaScript
arr.reduce((a, x, i) => [...a, x + (a[i - 1] || 0)], []);

// or, better explained here:
arr.reduce((a, x, i) => {
  // a: accumulator; x: current element; i: current index
  return a.length > 0 ? [...a, x + a[i - 1]] : [x];
}, []);
```

The short-circuiting works because accessing an _invalid_ index
returns `undefined` instead of blowing up:

```JavaScript
>> arr = [1, 2, 3]
Array(3) [ 1, 2, 3 ]

>> arr[5]
undefined

>> arr[5] || 42
42
```

For discussion on the cumsum topic, see <https://stackoverflow.com/a/44081700>.

---

## Bash scripting

See <https://mywiki.wooledge.org/BashFAQ/028> about accessing bundled files:

```bash
cd "${BASH_SOURCE%/*}/" || exit
```

---

`jq` can be used to create JSON files from plain text.

See <http://joshmontague.com/posts/2014/create-json-with-jq/> for a primer.

---

You can use [tee](https://www.gnu.org/software/coreutils/manual/html_node/tee-invocation.html)
and [process substitution](https://www.gnu.org/software/bash/manual/html_node/Process-Substitution.html)
to split and rejoin `stdout` from multiple processes.

```bash
command1 | tee >(command2) >(command3) > /dev/null | command4
```

or

```bash
((command1 | tee >( command2 >&3) | command3) 3>&1) | command4
```

Note though that:

> HOWEVER, there is nothing in this pipeline (or the one in your own solution)
> which will guanrantee that the output will not be mangled.
> That is incomplete lines from command2 will not be mixed up with lines of command3.

One solution to this is to "_write the output from command2 and command3 to a file and_
_use `cat` to merge the data as input to command4_".

See <https://stackoverflow.com/q/23255841/5818220> for a discussion.

---

Use `#!/usr/bin/awk -f` as the AWK shebang.

## Other

Use <https://www.sessions.edu/color-calculator/> as a color calculator.
There might be better tools out there but for now this should do.

---

Use [ESLint](https://eslint.org/) for JavaScript linting;
use [stylelint](https://stylelint.io/) for CSS linting;
use ??? for HTML linting.

Use [Prettier](https://prettier.io/) for JavaScript auto-formatting.
