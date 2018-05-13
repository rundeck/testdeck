Testdeck
========

Testdeck is an E2E test harness for Rundeck and the popular Rundeck community docker image [```jordan/rundeck```](https://hub.docker.com/r/jordan/rundeck/).

Testdeck utilizes two test runners:
* bitscript for executable scripts/programs
* jest for an amazing experience


## Getting started

### Installing dependencies
> Follow the dependency name links to navigate to installation instructions.


[**Node.js**](https://github.com/creationix/nvm#install-script)  
It is highly recommended that node.js be installed and managed by nvm.

[**Rundeck CLI**](https://rundeck.github.io/rundeck-cli/install/)  
Java-based CLI required for some tests to complete.

[**Docker**](https://docs.docker.com/install/) / [**Docker-Compose**](https://docs.docker.com/compose/install/#install-compose)  
Docker compose

[**Chrome**](https://www.google.com/chrome/)  
Required for selenium tests. Travis-CI is configured to include the latest stable.
When the envar ```CI=true``` the [example](./__tests__/selenium-login.test.ts) will run Chrome
in headless mode.

Install node modules:  
```
npm install
npm install -g ts-node typescript
```

## Quick Start
```
./src/main.ts -h
Options:
  --version       Show version number                                  [boolean]
  -f, --filter    Regexp pattern to filter full test path against[default: ".*"]
  -j, --jest      Options to pass to Jest                 [string] [default: ""]
  -r, --runner    Select test runner              [choices: "bitscript", "jest"]
  -t, --teardown  Tear down environment after run     [boolean] [default: false]
  -h              Show help                                            [boolean]
```

Pick a runner and go:
```
./src/main.ts -r bitscript
```

Enter watch mode with jest:
```
./src/main.ts -r jest -j='--watch'
```

Add BitScript runner tests to ```./tests/```  
> Ensure these are executable via ```chmod u+x ./tests/my_awesome_contribution.bash```

Add Jest runner tests to ```./__tests__/```  
> Tests must have ```spec``` or ```test``` as the sub-extension

## Usage

### Bit.Script Runner
Do your tests *hashbang*? If so this is the runner for you!  
This runner will discover and ```exec``` tests in the ```./tests``` folder.

**Sucess**  ✔️  
The script exits with a return code that is 0.

**Failure**  ❌  
The script exits with a return code that is not 0.

**Output**  
Any stdout or stderr output from the script will be printed in the test results.

**Groups**  
Tests can be grouped into folders of one depth. This will reflect in the test output.

**Filter**  
Provide ```-f [regex]``` to filter tests on full file name.

### Jest
Jest is the premiere in luxury running. Premium features include:

* "Immersive" watch mode
* Interactively filter tests with regex on test name or file name
* Run only tests changed since last commit by default
* Test files can be run in parallel(even works with selenium!)

**Success**  ✔️  
An error is not thrown out of the test method.

**Failure**  ❌  
An error escapes and Jest has to catch it for you.
The commit log will preserve your failure for all eternity.

**Output**  
Jest will print console output as well as error contents.

**Groups**  
Each file is a test suite. Within files ```it```'s can be placed inside ```describe```'s.

**Shims**  
It is simple to create a TS or JS test that is a shim on an external script/executable.
See an example [here](./__tests__/shims/bash-shim.test.ts)