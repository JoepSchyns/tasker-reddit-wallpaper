# Tasker reddit wallpaper 
This repository contains the source code for a reddit wallpaper Tasker project. 

Features:
- Wallpapers from latest best images in a subreddit.
- Updates wallpaper every x minutes
- Minimum resolution wallpapers.
- Offline and online modus.
- Never see a wallpaper twice (when online).
- Cached wallpapers (when offline).
- Notification with wallpaper title, buttons to skip wallpaper and to open post in browser.

The main project logic is written in Javascript inspired by [TaskerJavaScriptHelpers](https://github.com/StephenGregory/TaskerJavaScriptHelpers). Similarly this repo contains a runner that runs Javascript as if it executed within Tasker and a builder that can be used to convert code for useage in a Tasker JavaScript action. Hats of for @StephenGregory for doing such a great writeup! This repo works very similarely with a few optimations:
- Es6 support by using webpack instead of browserify.
- Automatic re-running using nodemon.
- More [Tasker Javascript functions](https://tasker.joaoapps.com/userguide/en/javascript.html) are implemented.
- Tasker functions that are not implemented but are available throw an Error.
- Linting using Eslint.
- Testing using Jest.

## Tasker project structure
This tasker project tries to implement all of its logic using Javascript, however as Tasker does not expose every action (nor profiles) a bit of Tasker "wizardry" is used. 

2 profiles:
- `Refresh wallpaper` runs the script every x minutes.
- `Notification Click` handles clicking on te notification.

3 Tasks:
- `Update Wallpaper` main tasks, only runs Javascript.
- `Wallpaper Notification` implements the notify action for usage in Javascript.
- `Open browser` handles opening links from the notification.

## Use in Tasker
Latest version of the wallpaper script can be found in `dist/index.min.js` and the Tasker project can be either imported using [this DataUri](taskerproject://H4sIAAAAAAAAAOVXS4/bNhA+b36FIaC3hUXqaQGygHSTg5EiXbQb9LhgJdrmRi9QXG/y7zskJZmSaTs+BDn0YpEz5HD4zTczdPpEuq+UfyCCLDq+dpxFcWBrBzsLcVg74RL7y9jJ3t2lj7zZspKqRS2MPWdxoGvHk8q7NC+IoBmOvBhHGPkoCnDqaqFSl20m+CsFGYykhPYbfA8h5KHIC4PUpeOGbUl2XbZKXT2QIlZkXurCr5xUrECZn7rqKwV1RbO/6JbTbr/4h5RlS1rKU1eKpfqJVdr1vKmRchnO2GcxHLDvZ1WGYFbpGaetPE1+hvmBlJmPlEwOlVjs5SbRmxDKhFAmUlceKYFze+RsIEZnQIxiAASH3gTEEbIoSaIQMMbhdciiKWShAdnHA63FERTDE3ClKWgmQwMOyKEStpzJC8qPmr9vW7Wd8F2P6V1K2vahJF2X1VQsC1bvStbl+yWpC96wYikU26qlZl3qjsvH3Y9fd5f3qk1yld5Skn9pmQ329Ex554J7evS34IOfWF/Td7KHV87l/Q2ywDodOoWMJXYvNBdD7F6QNXY+RijwURBHiRm7mih+FgUTizeDnqTnZ8uKLovugXJqJEVCDsL74B5oLgbhJ1YoB+DbR6okr3W+33yQ2TCOdbgAo64lOV2+NLTt4YMDeujSwxMAknngpx5pocwYvIQwH4bccT/1DNpUO3U4A75M6SKXVm/PJBesqZ/hatVzQQ8sp8+s3ja8IlJ+zEYXLA3wSkzlWEZQWZd++taqksS+fzYhEn+FPM9MCPDaH9kvj/7SSp2tPEhKY3Tkdvpe3USzJhd9qGMzObCPzdwwOIZGjmlWumPAXVYX9NuyYvXypRv5Zieoq1WbPkVBJSsuKdcOsuj8XheEWgnsVzdQKEs3TiAOLBDjJPZQcg7iYAVKCdIE4mAC8Yjt50awLctngefiewawyc+PoRx6/lWUz2fymdT/rSUcn1mEZvibuqMF21FDdvSROmbHrekx5oc9xLbwB70OW3Rhr7NRKrpgM76gW811BkzJDME/WCc+lrSCEG0ErXQFgcHYMnTNfmw6YdbvOTvYUHN6fhzz0OxR5zjyZ0vrxe+8eevMmE0vhQfDUAUJB5Zw1nAmvkMpJON6d6M6w8leNIvA1BFvwj1v4oGxzJ9CN1UGJ0pLkJFVOw/z1HB8yfA80lNtMtcadUdOZrG/TAg8JcRn+u0nEuK0F/w6UtiU/wcqXG9S4WmT8sLVKvGiGx7G0J7CSZOaFgPzDRDd8gIIsWf2JgOLWdxNJGZ2sc1uEF/teZda2HHRyG5ZXL/w0uxWt70rLjUdm+5Hms7YrB6aGt7FgIrkiC4H26EWjDr9R+WIQM/Act8NYMhhL21aKAOp27SDgIMO3h3DitQd7fb0nPhwJWie7TmIghuDZmG//up/49m7/wD/rkF0mw8AAA==) or as xml:
``` XML
<?xml version="1.0"?>
-<TaskerData tv="5.13.7" dvi="1" sr="">
    -<Profile sr="prof2" ve="2">
        <cdate>1627161030641</cdate>
        <clp>true</clp>
        <edate>1632000206254</edate>
        <flags>8</flags>
        <id>2</id>
        <mid0>3</mid0>
        <nme>Refresh Wallpaper</nme>
        -<Time sr="con0">
            <fh>7</fh>
            <fm>0</fm>
            <rep>2</rep>
            <repval>30</repval>
            <th>0</th>
            <tm>0</tm>
        </Time>
    </Profile>
    -<Profile sr="prof6" ve="2">
        <cdate>1627676251521</cdate>
        <edate>1636996530615</edate>
        <flags>8</flags>
        <id>6</id>
        <mid0>5</mid0>
        -<Event sr="con0" ve="2">
            <code>2000</code>
            <pri>0</pri>
            -<App sr="arg0">
                <appClass>net.dinglisch.android.taskerm.Tasker</appClass>
                <appPkg>net.dinglisch.android.taskerm</appPkg>
                <label>Tasker</label>
            </App>
            <Str sr="arg1" ve="3">Current Wallpaper</Str>
        </Event>
    </Profile>
    -<Project sr="proj0" ve="2">
        <cdate>1631004304769</cdate>
        <name>Reddit wallpaper</name>
        <pids>2,6</pids>
        <tids>5,3,4</tids>
        -<Kid sr="Kid">
            <launchID>3</launchID>
            <pkg>space.joep.tasker</pkg>
            <vTarg>29</vTarg>
            <vnme>1.0</vnme>
        </Kid>
        -<Img sr="icon" ve="2">
            <nme>mw_action_perm_device_information</nme>
        </Img>
    </Project>
    -<Task sr="task3">
        <cdate>1627161039733</cdate>
        <edate>1636996938022</edate>
        <id>3</id>
        <nme>Update Wallpaper</nme>
        <pri>6</pri>
        -<Action sr="act0" ve="7">
            <code>131</code>
            <Str sr="arg0" ve="3">Tasker/wallpaper/index.min.js</Str>
            <Str sr="arg1" ve="3"/>
            <Int sr="arg2" val="0"/>
            <Int sr="arg3" val="45"/>
        </Action>
    </Task>
    -<Task sr="task4">
        <cdate>1627161197209</cdate>
        <edate>1636994820900</edate>
        <id>4</id>
        <nme>WallpaperNotification</nme>
        <rty>1</rty>
        -<Action sr="act0" ve="7">
            <code>523</code>
            <Str sr="arg0" ve="3">Current Wallpaper</Str>
            <Str sr="arg1" ve="3">%par1</Str>
            <Str sr="arg10" ve="3"/>
            <Str sr="arg11" ve="3">Wallpaper</Str>
            -<Img sr="arg2" ve="2">
            <nme>mw_action_perm_device_information</nme>
            </Img>
            <Int sr="arg3" val="0"/>
            <Int sr="arg4" val="1"/>
            <Int sr="arg5" val="3"/>
            <Int sr="arg6" val="0"/>
            <Int sr="arg7" val="0"/>
            <Int sr="arg8" val="0"/>
            <Str sr="arg9" ve="3"/>
            -<ListElementItem sr="item0">
                <label>Post</label>
                -<Action sr="action" ve="7">
                    <code>130</code>
                    <Str sr="arg0" ve="3">Open Browser</Str>
                    -<Int sr="arg1">
                    <var>%priority</var>
                    </Int>
                    <Int sr="arg10" val="1"/>
                    <Str sr="arg2" ve="3">%par2</Str>
                    <Str sr="arg3" ve="3"/>
                    <Str sr="arg4" ve="3"/>
                    <Int sr="arg5" val="0"/>
                    <Int sr="arg6" val="0"/>
                    <Str sr="arg7" ve="3"/>
                    <Int sr="arg8" val="0"/>
                    <Int sr="arg9" val="0"/>
                </Action>
            </ListElementItem>
            -<ListElementItem sr="item1">
                <label>Next</label>
                -<Action sr="action" ve="7">
                    <code>130</code>
                    <Str sr="arg0" ve="3">Update Wallpaper</Str>
                    -<Int sr="arg1">
                        <var>%priority</var>
                    </Int>
                    <Int sr="arg10" val="1"/>
                    <Str sr="arg2" ve="3"/>
                    <Str sr="arg3" ve="3"/>
                    <Str sr="arg4" ve="3"/>
                    <Int sr="arg5" val="0"/>
                    <Int sr="arg6" val="0"/>
                    <Str sr="arg7" ve="3"/>
                    <Int sr="arg8" val="0"/>
                    <Int sr="arg9" val="0"/>
                </Action>
            </ListElementItem>
        </Action>
    </Task>
    -<Task sr="task5">
        <cdate>1627162588926</cdate>
        <edate>1636996530615</edate>
        <id>5</id>
        <nme>Open Browser</nme>
        <pri>6</pri>
        -<Action sr="act0" ve="7">
            <code>512</code>
            <Int sr="arg0" val="1"/>
        </Action>
        -<Action sr="act1" ve="7">
            <code>547</code>
            <Str sr="arg0" ve="3">%par1</Str>
            <Str sr="arg1" ve="3">%WallpaperPostUrl</Str>
            <Int sr="arg2" val="0"/>
            <Int sr="arg3" val="0"/>
            <Int sr="arg4" val="0"/>
            <Int sr="arg5" val="3"/>
            <Int sr="arg6" val="1"/>
            -<ConditionList sr="if">
                -<Condition sr="c0" ve="3">
                    <lhs>%par1</lhs>
                    <op>13</op>
                    <rhs/>
                </Condition>
            </ConditionList>
        </Action>
        -<Action sr="act2" ve="7">
            <code>104</code>
            <Str sr="arg0" ve="3">%par1</Str>
        </Action>
    </Task>
</TaskerData>
```
## Running and building this repository
### Requirements
- Download and install the latest version of [Git](https://git-scm.com/downloads/).
- Download and install the latest (not the LTS) version of [NodeJS](https://nodejs.org/en/download/current/).
- Run `npm -g i npm` to get yourself the latest version of the npm package manager.

To check the tools have been set up properly, check that you can run `git version`, `node -v` and `npm -v` from a command terminal.

Execute the following commands in the (new, empty) directory where you want to set up the project:

- Checkout the code: `git clone git@github.com:JoepSchyns/tasker-reddit-wallpaper.git .`
- Install project dependencies: `npm install`
### Scripts
- You can run `npm run build` to build a minified version for usage in tasker.
- You can run `npm run serve` to start a development environment that will automatically rebuild changes.
- You can run `npm run lint` to lint the source code.
- You can run `npm run fix` to try and fix all linting issues automatically.
- You can run `npm run test` to run all predefined tests.

### Configuration variables
By changing the constants found in `src/helpers/constants.js` you can alter things such as: *subreddit*, *minimum resolution*, *reddit client*, etc.

## Repository structure
- `/dist/` contains files ready for use in Tasker.
- `/Docker/` TODO: a dockerized emulator for testing code on Android.
- `/src/` contains the main application source code.
  - `helpers/` contains helper functions used in multiple parts of the code.
  - `tasks/` contains main subroutines.
  - `Tasker.js` contains node implementations of Tasker Javascript functions.
- `Tasker/` Emulates the Tasker folder found in on the root of Android.
- `test/` contains test scripts.
