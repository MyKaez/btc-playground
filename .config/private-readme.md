Some dev dependenies or tasks require private configuration settings which must not be commited to git. Therefore, all private config files have to be added to .gitignore.
As other developers won't have a clue about the needed settings, this readme describes the desires structure and content.

# Root Folder
Put all files in a folder "/.config/private"

# ftp-deployment.json
{
    "url": string,
    "user": string,
    "password": string
}
