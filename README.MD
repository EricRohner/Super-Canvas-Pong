# Suralink Client Side Tech Assessment

## Table of Contents

  * [Features](#Features)
  * [Bug_fixes](#bug_fixes)
  * [Design_decisions](#Design_decisions)

## Features

  * All state contained in one component
  * Predictive Ai that can be made to miss
  * Customizable paddles and game ball
  * Random changes come in from the server livening up gameplay


## Bug_fixes

  * Removed deadBalls[]
  * Fixed bug where paddle would "catch" the ball when hitting with the top or bottom of the paddle

## Design_decisions

  * Could have added a checkbox to deactivate server randomization but I don't want a "boring mode" in my game
  * Could have cleared server randomization after every score. Commented in code where and how I would have done it. Sure, it'd be more fair but more boring too.
  * Broke a callback into three separate functions to make code easier to read.
  * Used destructuring and object merging to limit number of individual state variables and the bloat of logic and management functions that would go with it.