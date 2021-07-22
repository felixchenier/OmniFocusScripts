# OmniFocusScripts

This is a repository for the scripts I've built to ease my workflow with OmniFocus.


## Trello to OmniFocus ##

I love Trello. And I love OmniFocus.

I use Trello to manage tasks and projets with my students. As soon as there are more than one person working on a project, I have a Trello board for it. But I also use OmniFocus as my main hub for managing all my personal tasks on a day to day basis. The problem is that both programs are not obvious to keep in sync.

So I created this nice little javascript to fetch all the Trello cards, on all my Trello boards, that are assigned to me. These cards are then created as tasks in OmniFocus in corresponding projects. The nicest part of this script is that if a Trello card becomes completed or is not assigned to me anymore, then it becomes completed in OmniFocus. And if it becomes not-completed or becomes again assigned to me in Trello, then is also becomes not-completed in OmniFocus. Due dates are also synced.

Do not forget to enter your Trello key and token into the script before trying it. The method is indicated in the script.

Have fun.

PS Thanks to [Matthew Conto](https://github.com/nsh87/trello-geektool) for the original AppleScript skeleton I used as the basis for this new script.


## GitHub to OmniFocus ##

This script is very similar to *Trello to OmniFocus*. Every issue that is assigned to me on a specific project is created or updated in OmniFocus. This GitHub repository has to be public though.

Please enter the information relative to the GitHub repository in the header of the script before running it.
