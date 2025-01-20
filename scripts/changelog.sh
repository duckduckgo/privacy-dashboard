git log "$SOURCE_BRANCH" --since "$(git show -s --format=%ci $(git rev-list --tags --max-count=1))" --pretty='format:- %s'
