# 🔒 **Advanced Security**

[*back*](../../README.md)

## 👀 **Overview**
The security features implemented in PRISM make it harder for people with malicious intent to disrupt your conference. Features dictate what users are and aren't able to access the site, who can access committees, among other features to best protect conferences

## 📑 **References**
* [🔑 User Authorization](#-user-authorization)
    * [👤 Access Authorization](#-access-authorization)

    * [🛡️ Admin Authorization](#️-admin-authorization)

    * [✏️ Editing Authorization](#️-editing-authorization)

* [🔒 Committee Session Locking](#-committee-session-locking)
    * [🔐 Locking & Unlocking](#-locking--unlocking)

    * [🔓 Force Unlocking](#-force-unlocking)

* [📜 Logging](#-logging)

## 🔑 **User Authorization**
When the server is first started, an `Access Code` and an `Admin Code` must be created before anything else can be done

* ### 👤 Access Authorization
    * When a user first accesses the PRISM website, they have to verify access by entering the `Access Code` set on server startup

    * Users must also enter a first and last name so they are easily identifable 

    * This level of access grants users the ability to create, edit, and delete committees, as well as view live statuses and act as a session moderator

* ### 🛡️ Admin Authorization
    * Users who wish to access the `Configure` page and do certain actions must authorize themselves as admins

    * To admin authorize, a user must attempt to access an admin-only page (such as the `Configure` page), where they will be redirected to the `Admin Authorization` page

* ### ✏️ Editing Authorization
    1. Navigate to the `Configure` page

    2. Ensure you are authorized as an admin user

    3. Edit the details of user authorization you wish to change
        * `Access Code` for regular authorization code

        * `Admin Code` for admin authorization code

    * Editing access codes will require users to re-authorize, including yourself

## 🔒 **Committee Session Locking**
Committee Session locking locks users from becoming the session moderator of a committee if it already has one

* ### 🔐 Locking & Unlocking
    * A committee becomes locked if a user starts the committee's session
        * This is achieved by accessing the `Session` or `Setup` page of any committee

        * A committee cannot be accessed by other users while it is locked (except to view live status)
    
    * There are multiple ways a committee can become unlocked
        * Moderator closes the tab

        * Moderator loses internet access

        * Moderator's computer/device turns off

* ### 🔓 Force Unlocking
    1. Navigate to the `Configure` page

    2. Find the `Unlock Committee Session` section

    3. Click the `Lock Icon` button of the session you want to force unlock

    * Force unlocking can only be done by admin-authorized users

    * Force unlocking a committee will cause the current session moderated to be disconnected and automatically routed to the home page

## 📜 **Logging**
* Important information is logged to a console accessible on the `Configure` page

* There are three kinds of logs:
    * `Information` <span style="background-color: #679cff; width: 10px; height: 10px; display: inline-block;"></span> : Basic events like creating and deleting committees, typically not of concern

    * `Warning` <span style="background-color: #ecaa46; width: 10px; height: 10px; display: inline-block;"></span> : Notifications of potentially suspicious, unauthorized, or malicious activity that does not indicate an immediate problem but should be monitored if unsafe

    * `Error` <span style="background-color: #d34b4b; width: 10px; height: 10px; display: inline-block;"></span> : An issue directly impacting the operation of the server, likely meaning maintenance or intervention is required

* Logs can be downloaded by clicking the `Download Icon` button

* Logs can be cleared by pressing the `X` button