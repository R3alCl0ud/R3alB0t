const authChecks = require('./authChecks')

function userNav(user, currentPage, currentSubpage) {
    return {
        leftNavigation: {
            topSideBar: {
                companyIdentity: {
                    index: '#',
                    imgLocation: "/images/logo_color.png",
                    alt: "Image of Bourbon",
                    isCollapsed: true
                },
                sidebarMenuTrigger: {
                    iconName: "icon-menu"
                }
            }
        },
        rightNavigation: getRightNav(user),
        sideBarMenu: {
            searchBar: {
                placeHolder: "Search...",
                iconName: "icon-cup"
            },

            sidebarHeading: {
                heading: "My Features"
            },
            sidebarMenuIcons: [{
                mainIconName: "icon-home",
                menuName: "Home",
                dropDownIconName: "icon-arrow-left",
                page: "/",
                active: currentPage == "Home" ? true : false
            }, {
                mainIconName: "icon-wrench",
                menuName: "Dashboard",
                dropDownIconName: "icon-arrow-left",
                page: user ? ("/dashboard/me") : "/auth/login",
                active: currentPage == "Dashboard" ? true : false
            }, {
                mainIconName: "icon-login",
                menuName: "Donate",
                dropDownIconName: "icon-arrow-right",
                page: "https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=QST58L4QMZBUY&lc=US&item_name=R3alB0t&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHosted",
                active: currentPage == "Donate" ? true : false
            }]
        }
    }
}



function getRightNav(user) {
    userServers(user)

    return user ? {
        iconMapper: [],
        userIcon: {
            imgLocation: user.avatar ? `https://discordapp.com/api/users/${user.id}/avatars/${user.avatar}.jpg` : "https://discordapp.com/assets/1cbd08c76f8af6dddce02c5138971129.png",
            iconName: "icon-options-vertical",
            stringName: user.username
        },
        iconProfiles: {
            count: 2,
            icons: [{
                iconName: "icon-user",
                href: "/profile",
                stringName: " My Profile"
            }, {
                iconName: "icon-logout",
                href: "/auth/logout",
                stringName: " Logout"
            }]
        }
    } : {
        iconMapper: [{
            iconName: 'icon-login',
            page: "/auth/login",
            notify: 0
        }],
        iconProfiles: {
            count: 0,
            icons: []
        }
    }
}

function userServers(user) {
    if (user) {
        let guildIcons = [];

        const guilds = authChecks.adminInGuilds(user)

        guilds.forEach(guild => {

            let Abreviation = guild.name.split(" ")
            for (const word in Abreviation) {
                Abreviation[word] = Abreviation[word][0]
            }
            Abreviation = Abreviation.join('');
            // console.log(Abreviation)
            guildIcons.push({
                name: guild.name,
                icon: guild.icon ? `https://discordapp.com/api/guilds/${guild.id}/icons/${guild.icon}.jpg` : null,
                abreviation: Abreviation
            })
        })
        
        return guildIcons
    }
    else {
        return false;
    }
}




exports.userNav = userNav;
exports.userServers = userServers;