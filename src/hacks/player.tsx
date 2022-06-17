import { h } from "preact"
import PlayerName, { NameInfo } from "../components/PlayerName"
import { getMembership } from "../hack"
import { ArgumentFailureError, customMessage, InputTypes, success } from "../swal"
import { Category } from "./base/categories"
import { withCategory } from "./base/registry"

withCategory(Category.PLAYER, ({ hack, toggle }) => {
    hack("Set Gold", "Set's the amount of gold you have currently.", async (hack, player) => {
        const value = await InputTypes.integer("Please enter the amount of gold you want to get.", 1, 9999999)
        player.data.gold = value
        success(`You now have ${value} gold.`)
    })
    hack("Set Level", "Set's the level of your player.", async (hack, player) => {
        const value = await InputTypes.integer("Please enter the level you want to be.", 1, 100)
        if (value === 1) {
            player.data.stars = 0
        } else if (value === 2) {
            player.data.stars = 10
        } else {
            const offsetLevel = value - 2
            const xpConstant = 1.042
            player.data.stars = Math.round((((1 - Math.pow(xpConstant, offsetLevel)) / (1 - xpConstant)) * 20) + 10)
        }

        player.data.level = value
        success(`You are now level ${value}.`)
    })
    hack("Set Member Stars", "Set's the amount of member stars you have currently.", async (hack, player) => {
        const value = await InputTypes.integer("Please enter the amount of member stars you want to get.", 1, 9999999)
        player.data.storedMemberStars = value
        success(`You now have ${value} member stars.`)
    })
    hack("Set Bounty Points", "Set's the amount of member stars you have currently.", async (hack, player) => {
        const value = await InputTypes.integer("Please enter the amount of bounty points you want to get.", 1, 100)
        player.data.bountyScore = value
        success(`You now have ${value} bounty points.`)
    })
    hack("Obtain Conjure Cubes", "Obtain as many conjure cubes as you want.", async () => {
        const value = await InputTypes.integer("How many conjure cubes do you want to obtain?", 1, 99)
        for (let i = 0; i < Math.min(99, value); i++) { _.instance.prodigy.giftBoxController.receiveGiftBox(null, _.gameData.giftBox.find((x: any) => x.ID === 1)) }
        success(`You now have ${value} conjure cubes.`)
    }, true)
    toggle("Toggle Membership", (hack, player, gameData, toggled) => {
        getMembership(toggled) // TODO: If on extension, use _ method.
        success(`You are ${toggled ? "now a member" : "no longer a member"}.`)
    }, (hack, player) => player.hasMembership())
    hack("Set Wins", "Set's the amount of wins you have currently.", async (hack, player) => {
        const value = await InputTypes.integer("Please enter the amount of wins you want to get.", 0, 9999999)
        player.data.win = value
        success(`You now have ${value} wins.`)
    })
    hack("Set Losses", "Set's the amount of losses you have currently.", async (hack, player) => {
        const value = await InputTypes.integer("Please enter the amount of losses you want to get.", 0, 9999999)
        player.data.loss = value
        success(`You now have ${value} losses.`)
    })
    hack("Get All Achievements", "Gets every achievements.", async (hack, player) => {
        for (let i = 0; i < 100; i++) {
            player.achievements.data.progress[i] = 10
        }
        player.achievements.updated = true
        success("You now have every achievements.")
    })
    hack("Set Dark Tower Floor", "Set's the floor you are on in the dark tower.", async (hack, player) => {
        const floor = await InputTypes.integer("Please enter the floor you want to be on.", 1, 100)
        player.data.tower = floor
        success(`You are now on floor ${floor}.`)
    })
    hack("Change Name", "Changes the name of your player.", async (hack, player, gameData) => {
        const names = gameData.name
        const nicknames = gameData.nickname
        const objInfo: NameInfo = {
            first: player.name.data.firstName,
            middle: player.name.data.middleName,
            last: player.name.data.lastName,
            nickname: player.name.data.nickname
        }

        const name = await customMessage({
            title: "Set Player Name",
            html: <PlayerName names={names} nicknames={nicknames} obj={objInfo} />,
            showCancelButton: true
        })
        if (name.dismiss) throw new ArgumentFailureError()
        player.name.data.firstName = objInfo.first
        player.name.data.middleName = objInfo.middle
        player.name.data.lastName = objInfo.last
        player.name.data.nickname = objInfo.nickname
        success(`You are now ${player.name.getName()}.`)
    })
    hack("Set Grade", "Set's the grade of your account.", async (hack, player) => {
        const value = await InputTypes.integer("Please enter the grade you want to be.", 1, 8)
        player.grade = value
        success(`You are now grade ${value}.`)
    })
})
