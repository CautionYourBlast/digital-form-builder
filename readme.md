# XGov Digital Form Builder
[![Gitter](https://badges.gitter.im/XGovFormBuilder/Public.svg)](https://gitter.im/XGovFormBuilder/Public?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

This repository is a mono repo for
  - @xgovformbuilder/[runner](https://github.com/XGovFormBuilder/digital-form-builder/tree/master/runner) - Hapi server which can 'run' a form from a JSON file
  - @xgovformbuilder/[engine](https://github.com/XGovFormBuilder/digital-form-builder/tree/master/engine) - Plugin for the above hapi server which serves a schema and the components
  - @xgovformbuilder/[designer](https://github.com/XGovFormBuilder/digital-form-builder/tree/master/designer) - A React app to aide in form building
  - @xgovformbuilder/[model](https://github.com/XGovFormBuilder/digital-form-builder/tree/master/model) - Serves the data model and other helpers

The repos are forked from [DEFRA's digital form builder](https://github.com/DEFRA/digital-form-builder). 

This is a (getting close to) zero-install yarn 2 workspaces repository. .yarnrc.yml allows us to align our yarn environments. Please commit any plugins in .yarn, but do not commit your .yarn/cache. CI will save and restore the caches. 

Workspaces will deal with sym-linking the packages, so we do not have to manually run `yarn link`. 
It will also deal with hoisting the node_modules for any packages that are shared between the repos, thus decreasing any install times. Hopefully it all just works™️.

## Setup
**Always run scripts from the root directory.**

1. Make sure you are using node >=12. `node --version`.
2. Make sure you have yarn 2 installed.
3. Run `yarn setup`, this script will:
   1. Run `$ yarn` command to install all dependencies in all workspaces.
   2. Run `$ yarn build` to build all workspaces (this is needed because dependencies can depend on each other).
   3. Run `flow-mono` commands to adjust flow types.

As already mentioned, **always run scripts from the root directory.** because workspaces don't have scripts or packages you need to run from inside their folders and by running in the root directory yarn 2 can resolve the scripts/packages properly.

To learn more about workspaces, check these links:
- [Workspaces in Yarn](https://classic.yarnpkg.com/blog/2017/08/02/introducing-workspaces/)
- [Workspaces](https://classic.yarnpkg.com/en/docs/workspaces)

  
  
### I want to...

#### run a specific workspaces' script 
`$ yarn [runner|designer|engine|model] name-of-script` 

eg.: `yarn desginer start` or `yarn runner add babel-core --dev`


#### run a script for each of the workspaces
`$ yarn workspaces foreach run name-of-script`


#### watch and build for changes across all repos
I wouldn't recommend it unless you have a beefy processor.

`$ yarn watch`


#### add a dependency to all workspaces

`$ yarn add packagename`

#### create a new workspace

1. create a new directory for the workspace and yarn init it
    1. `$ mkdir myNewLib`
    2. `$ cd myNewlib`
    3. `$ yarn init`
2. in the root `package.json` 
    1. add `myNewLib` to the `workspaces` object.



## Troubleshooting
If you have any problems, submit an issue or send a message via gitter.

#### Cannot resolve module `xxx`. [cannot-resolve-module]
1. `$ yarn flow-mono create-symlinks`
2. `$ yarn flow-mono install-types`
3. `$ yarn flow-mono create-stubs`

#### Error: ENOENT: no such file or directory, scandir 'xxx/node_modules/node-sass/vendor'
`/vendor` is not present since it hasn't been built or rebuilt. You may also get this issue with `core-js`, `fsevents`, `nodemailer` etc.
`$ yarn rebuild` to rebuild all the packages
`$ yarn rebuild only node-sass` to rebuild just node-sass




## gotchas

### flow
- We're using [flow](https://flow.org) for static type checking. For each of the modules (runner, engine, designer). To prevent issues with unresolved modules, flow-typed is run on postinstall.
- Flag a file to be checked by flow with `// @flow` at the top of the file.
- It's advisable to install the eslint plugin for your text editor, and set the parser to babel-eslint to catch any type errors.

### CI

#### Build process
1. Pushes to any branch will start the build process
2. `.circleci/circle_trigger.sh` will check for any changes in our packages, and if builds have failed previously
3. `circle_trigger.sh` will trigger a workflow via the API. It will pass the parameters model, engine, runner, designer (bool) to the workflow.
4. If there are any changes to a workspace, it will be built and tested. 
  - If an upstream dependency, like model or engine has changed, the downstream dependencies (engine, runner, designer) will also be built and tested. 

#### Development environment

The development workflow is triggered whenever a PR is merged into master and you can monitor it on the repository's [action tab](https://github.com/XGovFormBuilder/digital-form-builder/actions).

The workflow contains two separate jobs that run in parallel, one for the Runner and another for the Designer application.

Both jobs work as follows:

1. Build the docker image with all dependencies.
2. Push image to Heroku Container Registry.
3. Release the latest image.

The latest releases will be running here: [Runner](https://digital-form-builder-runner.herokuapp.com) / [Designer](https://digital-form-builder-designer.herokuapp.com).


## contributions
Issues and pull requests are welcome. Please check [CONTRIBUTING.md](https://github.com/XGovFormBuilder/digital-form-builder/tree/master/.github/CONTRIBUTING.md) first!
