enum ROLE{
    ADMIN,
    USER
}

const permissions = {
    "templates.edit": [ROLE.ADMIN],
    "templates.delete": [ROLE.ADMIN],
    "templates.read": Object.values(ROLE)
}