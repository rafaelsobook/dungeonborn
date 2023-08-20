import BABYLON from './_snowpack/pkg/babylonjs.js'
import "./_snowpack/pkg/babylonjs-loaders.js";
import io from "./_snowpack/pkg/socket.io-client.js"
import * as GUI from './_snowpack/pkg/babylonjs-gui.js';

import normalNpc from './creations/normalNpc.js';
import records from "./creations/itemRecords.js";
import toSell from "./creations/tosell.js"
import monsterloot from "./creations/monsterloot.js"
import tips from "./creations/tips/tips.js"
import foodInfo from "./creations/foods/foodsInfo.js"
import npcInfos from "./creations/npcDetails/npcDet.js"
import ranks from "./creations/ranksInfo/ranksInfo.js"
import objectivesChoices from "./creations/objectiveChoices.js"
import starterBlessings from "./creations/blessings/starters.js"
import oneIntroSpeech from "./creations/speeches/OneIntroSpeech.js"
import bonusItems from './creations/bonuses/bonusItems.js';
import bonusInfos from "./creations/bonuses/bonusInfo.js"
import allElements from './creations/elements.js';
import skills from "./creations/skills.js"
import allDemonz from './creations/demonsInfo.js';
const log = console.log


const {Matrix, Texture, Axis,ParticleSystem, Mesh, ShadowGenerator, ActionManager, ExecuteCodeAction, GlowLayer, PointLight, Engine, Scene, ArcRotateCamera, HemisphericLight,DirectionalLight, Vector3, MeshBuilder, FreeCamera, SceneLoader, Color3, StandardMaterial} = BABYLON

const webSocketURL = "https://dbtcp.herokuapp.com"|| "ws://localhost:3000" || "https://dungeonborntcpcon.onrender.com"
const APIURL = "https://dbserver.herokuapp.com" || 'http://localhost:8100' || 'https://fair-ruby-fly-tam.cyclic.app'

const apiOpt = (meth, toPost, token) => {
    if(!toPost){
        return {
            method: meth, // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
            'authori': token ? `fawad ${token}` : '',
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        }
    }else{
        return {
            method: meth, // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
            'authori': token ? `fawad ${token}` : '',
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: toPost ? JSON.stringify(toPost) : ''
        }
    }    
}

let moveNums = { straight: 0, leftRight: 0 }
let rgbColors = [
    {
        name: 'wind',
        rgb: {r:0.03, g:0.92, b:0}
    },
    { //walang water pero saka mona burahin to
        name: 'water',
        rgb: {r:0, g:0.62, b:0.73}
    },
    {
        name: 'earth',
        rgb: {r:0.95, g:0.94, b:0}
    },
    {
        name: 'fire',
        rgb: {r:0.81, g:0.03, b:0.03}
    },
    {
        name: 'light',
        rgb: {r:1, g:1, b:1}
        
    },
    {
        name: 'dark',
        rgb: {r:0.53, g:0.03,b: 0.68}
    }
]

const canvas = document.getElementById("renderCanvas")

const homePage = document.querySelector(".home-page")

const navChoices = document.querySelectorAll(".nav-choice")
const loginPage = document.querySelector(".login-container")
const popUp = document.querySelector(".popup")
const allRegClass = document.querySelectorAll(".toreg")
const installGame = document.getElementById("installGame")
const continueBtn = document.getElementById("continue")

let mobileMaxWidth = 500
let maxWidthForGameplay = 650
let deferredPrompt

if(window.innerWidth < mobileMaxWidth){
    // the login register nav 
    const logingRegisterDiv = document.querySelector(".dark-nav")
    logingRegisterDiv.style.display = 'none'
    loginPage.style.display = 'none'   

    installGame.style.display = 'block'
    window.addEventListener("beforeinstallprompt", e => {
        log(e)
        deferredPrompt = e
    })        
    installGame.addEventListener("click", e => {
        if(!deferredPrompt) return fitScreenWarn("The App is already Installed <br /> on your device")
        deferredPrompt.prompt()
        deferredPrompt.userChoice
        .then( choiceResult => {
            if(choiceResult.outcome === "accepted"){
                console.log("User want to install the game")
            }
            deferredPrompt = null

            localStorage.setItem("dbapp", JSON.stringify({isInstalled: true})) === null
        })
        .catch(error => console.log(error))
    })
}else{
    installGame.style.display = 'none'
}
// login page
const homeInputs = document.querySelectorAll(".inputs")
homeInputs.forEach(inp => inp.value = '')
const loginBtn = document.getElementById("loginBtn")
const registerBtn = document.getElementById("createRegister")
const usernameInp = document.getElementById("usernameInp")
const passwordInp = document.getElementById("passwordInp")
const confirmpass = document.getElementById("confirmpass")
const backToHomeBtns = document.querySelectorAll(".back-to-home")


// laoding screens
let loadedMesh = 0
let loadInterval
let tipsInterval
let loadingWhat = 'loading ...'
const lScreen = document.getElementById("loadingScreen")
const loadPercent = document.querySelector(".ls-percent")
const loadingCap = document.querySelector(".lc-cap")
const noInternetCont = document.querySelector(".nointernet")
const introLs = document.querySelector(".intro-load-screen")
const tipsLabel = document.querySelector(".ls-tips");

// warning label
const warningCont = document.querySelector(".warning-screen")
const sideNotif = document.querySelector(".new-craft-notif")

// SETUP CHARACTER
const setupCont = document.querySelector(".setup-container")
const category = document.querySelector(".category")
const choicesLabel = document.querySelector(".choices-label")
const choicesList = document.querySelector(".choices-list")
const nameInput = document.querySelector(".set-up-name-inp")
const createAndStart = document.getElementById("createAndStart")
const doneSetup = document.getElementById("doneSetup")
const enterNameCont = document.querySelector(".naming-container")

// right ui || game controls
const rightLowerUI = document.querySelector(".right-lower-ui")
const rightUpperUI = document.querySelector(".right-upper-ui")
const rightUIBtns = document.querySelectorAll(".rui-btn")
const attackBtn = document.getElementById("attackBtn")
const attackImg = document.querySelector(".attack-img")
const swordPicBtn = document.querySelector(".swordpic-btn")
const throwBtn = document.querySelector(".throw-btn")
const adventurerIcon = document.querySelector(".myquests");

// PROFILE
const profile = document.querySelector(".profile")
const occupAndTitleCont = document.querySelector(".occupation-titles")
const leftbackG = document.querySelector(".left-backg")
const myStatContainer = document.querySelector(".whole-stats-container")
const animateUpBtns = document.querySelectorAll(".stat-close")
const equipedItemsCont = document.querySelector(".equipedItems")
// const upgradeCont = document.querySelector(".upgradeCont")
// const profDetailsCont = document.querySelector(".prof-details")
const upgradeBtns = document.querySelectorAll(".button-upgrade")
const invList = document.querySelector(".inv-list")
const coin = document.querySelector(".coin")
const points = document.querySelector(".points")
const lvl = document.querySelector(".lvl")
const rank = document.querySelector(".rank")
const equipedList = document.querySelectorAll(".arms-bx")

// CONVERSATION
const speechCont = document.querySelector(".speech-cont")

// POP UP TODO ACTIONS WHEN COLLIDED WITH TREES OR MINES
const popupActionCont = document.querySelector(".popup-actions-container")
const pacBtnImg = document.querySelector(".pac-btnimg")
const pacBtn = document.querySelector(".pac-btn")

// WHEN ACQUIRED ITEM
const acquiredLists = document.querySelector(".acquired-lists")

// ITEM INFO
const itemInfoCont = document.querySelector(".item-info-cont")
const closeBtn = document.querySelectorAll(".close-btn")
const itemInfoImg = document.querySelector(".iet-img")
const itemInfoName = document.querySelector(".iet-item-name")
const plusInfo = document.querySelector(".plus-info")
const itemDesc = document.querySelector(".iet-desc")
const itemInfoBtns = document.querySelector(".item-info-btns")

// WORLD CHAT
const worldChatCont = document.querySelector(".world-chat-container")
const chatMinBtn = document.querySelector(".chat-min-btn")
const messageInp = document.querySelector(".message-inp")
const sendBtn = document.getElementById('send-btn')
const chatList = document.querySelector('.chats-list')
const plOnline = document.querySelector('.players-online')
const modeOptCont = document.querySelector('.mode-opt-cont')

// SCROLL
const scrollCont = document.querySelector('.scroll-cont')
const scrollMess = document.querySelector('.scroll-mess');
const scrollTtle = document.querySelector('.scroll-ttle');
const scrollBtns = document.querySelector('.scroll-btns');
// MERCHANT
const merchantChoice = document.querySelector('.merchant-choice-cont')
const shopChoiceCont = document.querySelector('.shopchoice-cont')
const shopCateg = document.querySelector('.shop-categ')
const shopList = document.querySelector('.shop-list')

// LIFE MANA STAMINA
const lifeManaStamCont = document.querySelector(".simple-details-gui")
const lvlAndName = document.querySelector(".lvl-name")
const lifeBar = document.querySelector(".life-ui")
const manaBar = document.querySelector(".mana-ui")
const lifeCap = document.querySelector(".lifeCap")
const manaCap = document.querySelector(".manaCap")
const stamBar = document.querySelector(".stamina-bar")
const stamCap = document.querySelector(".stamCap")

const hungStat = document.querySelector(".hungStat")
const restStat = document.querySelector(".restStat")
// negative stats
const negativeStatCont = document.querySelector(".negative-stats")

//  apartment
const apartCont = document.querySelector(".apartment-cont")
const apartName = document.querySelector(".aprt-name")
const pRent = document.querySelector(".pRent")

const apartBtns = document.querySelector(".aprt-btns")
const cancelBuy = document.querySelector(".cancel-buying");
// CAPTION FOR RESTING OR EATING OR SLEEPING
const doingCont = document.querySelector(".doing-container")
const doingName = document.querySelector(".doing-name")
const cancelDoingBtn = document.querySelector(".cancel-doing")

// STORY MODE CAPS
const storyBoardCont = document.querySelector(".storyboard-container")
const questionCont = document.querySelector(".questions-cont")


const aprtLoadingBx = document.querySelector(".aprt-loading-bx")
const aprtLoadLabel = document.querySelector(".aprt-load-cap")
const apartInfos = document.querySelector(".aprt-info")
// CRAFTING
const craftIcon = document.querySelector(".crafts");
const craftCont = document.querySelector(".craft-container")
const craftImgs = document.querySelectorAll(".craft-img")
const cancelParents = document.querySelectorAll(".cancel-parent")
const toCraftCont = document.querySelector(".craft-btns-cont");

// COOKING
const cookCont = document.querySelector(".toCook-cont")
const toCookList = document.querySelector(".tocook-list")

// GUILD
const guildCont = document.querySelector(".guild-cont")
const guildTtle = document.querySelector(".guild-title")
const claimBtn = document.querySelector(".claimReward");
const guildBtn = document.querySelector(".guild-yes");
const guildSellItems = document.querySelector(".guild-sell-items");

// NOTIF POP UP
const notifPopup = document.querySelector(".notif-popup");
const notifTtle = document.querySelector(".notif-ttle");

// quest container
const questCont = document.querySelector(".quest-container");
const questList = document.querySelector(".quest-list");

// ADVENTURE
const advCont = document.querySelector(".adventurer-cont");
const advDet = document.querySelector(".adv-det");
const advQuestLists = document.querySelector(".adv-quests");

// QUESTS INFO
const rewardInfoCont = document.querySelector(".rewardinfo-cont")
const rewardImg = document.querySelector(".rew-mons-img")
const rewardTtle = document.querySelector(".reward-ttle")
const rewardDesc = document.querySelector(".reward-desc")
const rankFloat = document.querySelector(".rank-float")
const itemRewardsList = document.querySelector(".rewards-pictures")
const coinReward = document.querySelector(".rc")
const acceptQuestBtn = document.querySelector(".accept-quest-btn")
const deleteQuestBtn = document.querySelector(".delete-quest-btn")
// TOP ADVENTURER DETAILS
const topAdventurersCont = document.querySelector(".alladventurer-detail-cont")
const toplist = document.querySelector(".adc-list")

// MY SKILLS
const skillCont = document.querySelector(".skills-container")
const AllSkillInfoCont = document.querySelector(".all-myskills-container")
const skillCateg = document.querySelector(".skill-categ")
const myskillLists = document.querySelector(".myskill-list")
// OPENING SCROLLS
const scrollChoiceCont = document.querySelector(".scroll-choices-cont")
const scrollList = document.querySelector(".scrl-list")
const scrlLeft = document.querySelector(".scrl-left")
const scrlRight = document.querySelector(".scrl-right")
// CRAFTING SWORS
const compatibleCont = document.querySelector(".compatible-mat-cont")
const ttleOfItemsDisplay = document.querySelector('.cmc-ttle')
const compatibleItemList = document.querySelector('.cmc-list')
const craftWeaponBtn = document.querySelector('.cmc-button')
const craftCost = document.querySelector('.cmc-cost')
// SETTINGS
const settingsCont = document.querySelector(".settings-container")
const settingsNav = document.querySelector(".setting-nav")
const signOutBtn = document.getElementById("signOut")

// ABOUT PAGE
const aboutCont = document.querySelector(".about-container")
const abtBackBtn = document.querySelector(".back-btn")
// NEWS
const newsContainer = document.querySelector(".news-container")
const newsBtn = document.querySelector(".news-btn")
newsBtn.addEventListener("click", () => newsContainer.style.display = "none")

// fps
let divFps = document.querySelector(".fps");
// tutorial container
let tutorialCont = document.querySelector(".tutorial-cont");


// for creating element
const createElement = (elemName, classN, textInside, callB) => {
    const newElem = document.createElement(elemName)
    newElem.className = classN

    newElem.innerHTML = textInside ? textInside : ''

    if(callB) newElem.addEventListener("click", callB)

    return newElem
}
// converting an item details from tcpcon
const createItemObj = (dat) => {
    const detal = dat.details.split(",")
    const dPos = dat.pos.split(",")
    const itemObj = { 
        name: dat.name, 
        itemType: dat.spawntype, 
        plusDef: detal ? parseInt(detal[0]) : 0, 
        plusDmg: detal ? parseInt(detal[1]) : 0, 
        magRes: detal ? parseInt(detal[2]) : 0, 
        plusMag: detal ? parseInt(detal[3]) : 0, 
        price: detal ? parseInt(detal[4]) : 0,
        durability: detal ? parseInt(detal[5]) : 0,
        cState: detal ? parseInt(detal[5]) : 0,
        x: parseInt(dPos[0]),
        z: parseInt(dPos[1])
    }
    return itemObj
}

let theGame
let isInTutorialMode = false

let xcor //coordinates ng joystick sa world axis
let zcor //coordinates ng joystick sa world axis
let bodyx
let bodyz
let myId
let userId
let curPos
let myCharDet
let myBtf
let canPress = true
let botMoving = false
let engine
let scene

let isLoading = false
let houzess = []
let players = []
let bonFirezz = []
let bedLeavxx = []
let Monsterz = []
let demons = []
let simpleNpc = []

let theBonFirez = []
let theFlowerz = []
let theBedLeaves = []
let theHouzes = []
let allUzers = []
let theOrez = []
let theTreez = []
let theSeedz = []
let theMonz = []
let theTreasurez = []
let theLootz = []

// meshes
let theCharacterRoot
let wingRoot
let patsRoot
let wolfRoot
let goblinRoot
let minotaurRoot
let snakeRoot
let golemRoot
let monoloth
let rabbit
let cam
let shadowGen
let mugMesh
let allsword

let sharpRock
let slash
let allhelmets
let allshields
let Seed
let wholeTree
let oldHouseMesh
let treasure
let stamFlower
let herbleaves
let ironMesh
let seedMesh
let allHouses
let digMesh
let magicCircle
let bonFireMesh
let bedLeaveMesh
let roadplank
let dangerPlank
let smoke
let fire
let thePeeble
let fakeShadow

let worldTime = 1
let isInformed = false
let light
let hemLight
let pointLight
let pLightz = []
let rewardInfo = {}
let magicCircleTimeOuts = []


// for configs bugs
let isSpawningLoading = false
function makeRandNum(){
   return Math.random().toString().split(".")[1]
}
function randomRange(startingInt, upto){
    return startingInt + Math.random() * upto
}
function closeGameUI(notInclude){
    rightLowerUI.style.display = "none"
    rightUpperUI.style.display = "none"
    skillCont.style.display = "none"
    profile.style.display = "none"
    switch(notInclude){
        case "items":
            if(!profile.style.display) profile.style.display = "none"

        break
    }
}
function openGameUI(det){
    rightLowerUI.style.display = "block"
    rightUpperUI.style.display = "flex"
    skillCont.style.display = "flex"
    if(!det) return
    if(det.currentPlace.includes("apartment"))displayElems([craftIcon], "none")
    det.rank === "none" ? adventurerIcon.style.display = "none" : adventurerIcon.style.display = "block"
    if(!det.mycrafts.length){
        craftIcon.style.display = "none"
    }else{
        craftIcon.style.display = "block"
    }
}
function showNotif(message, dura){
    notifPopup.style.display = "block"
    notifTtle.innerHTML = message

    dura && setTimeout(() => closeNotif(),dura)
}
function closeNotif(){
    notifPopup.style.display = "none"
}
function showChartMesssage(ttleOfChart, theMessage, justifyStyle, alignStyle, textAlignStyle){
    tutorialCont.innerHTML = ''
    const divBx = createElement("div", "tutorial-bx")
    const pTitle = createElement("p", "tut-ttle", ttleOfChart)
    const pDesc = createElement("p", "tut-line", theMessage)
    pDesc.style.justifyContent = justifyStyle
    pDesc.style.alignItems = alignStyle
    pDesc.style.textAlign = textAlignStyle
    divBx.append(pTitle)
    divBx.append(pDesc)
    tutorialCont.append(divBx)
}
// paypal.Buttons({
//     createOrder: function(data,actions){
//         return actions.order.create({
//             purchase_units: [{
//                 amount: {
//                     value: "1"
//                 }
//             }]
//         })
//     },
//     onApprove: function (data, actions){
//         return actions.order.capture().then( function (details){
//             alert("Transaction Completed By " + details.payer.name.given_name)
//         })
//     }
// }).render("#paypal")
class App{
    constructor(userdet){
        this._engine = new Engine(canvas, true)
        this._scene = new Scene(this._engine)
        const tryCam = new FreeCamera("asdfw", new Vector3(0,0,0), this._scene)

        this.userId = userdet.details._id
        this.userDetails = userdet.details
        this.token = userdet.token
        this.socket = null

        // forbidden place to craft
        this.notAllowedCraft = ["hl_club", "apartment", "guildhouse"]
        this.placeWithLowCam = ['guildhouse', 'apartment', 'crafthouse', "hl_club"]
        this.yPos = .85 // default postion of box where Meshes Parented in

        this.det
        this.myChar
        this.startSpeed = 0
        this.runSpeed =  3.7 
        this.walkSpeed = 1.5
        this.npcWalkSpd = 1
        this.openingSpd = 50
        this.myLoadingBarMax
        this.myLoadingBarMin = 0
        this.intervalUntilFull // para to sa bar pag nag oopen ng treasure or crafting
        this.manaCollected = 0
        this.cam
        this.camZoomingOut = false
        this.camZoomingIn = false
        this.btf
        this.socket
        this.savingTimeout // it will clear everytime you move so it wont span stopMoving fetch

        this.scripts = []
        Monsterz = []
        this.enemyRegistered = [] // for action manager
        this.NPCs = []
        this.guards = []
        this.Trees = []
        this.AllFlowerz = []
        this.Treasures = []
        this.Ores = []
        this.Orbs = []
        this.Seedz = []
        this.lootz = []
        this.Crytalz = []
        this.blocks = []
        this.currentPlace
        this.prevPlace
        this.prevLoc = { x: 0, z: 0}
        this.canDropHere = true
        this.craftFunc = undefined

        this.quests = []
        this.questToTake

        // BUFFS
        this.plusDmg = 0
        this.plusDef = 0
        this.plusCore = 0
        this.plusmagic = 0
        // DAMAGE MULTIPLIED TO FIX
        this.physicalX = 6
        this.weaponX = 7
        this.magX = 10

        this.hpRegenInterval
        this.mpRegenInterval
        this.spRegenInterval
        this.musicInterval

        // HITS IN RECOURCES
        this.recourceHits = 0 // for tree and ore
        this.hitRecourceInterval
        // ALL WITH STATUS AFFECTED
        this.bashed = []
        this.monsForBash = ['slime', 'goblin']
        this.allScaling = []
        this.allRotating = []
        this.allVanishing = []
        this.floatingMeshes = []
        this.flyingWeaponz = []

        //  bashed power
        this.minBash = 1.033
        this.midBash = 2.060
        this.bigBash = 3.097

        // FOR ACTIONS
        this.hideMeshTimeOut // for camera when coliiding with rocks
        this._attackTimeout // to disable to attack = true after 500ms
        this.timeOutToSave // when hit by enemy multiple time it wont save rapidly it will save every 3sec of inactivity before the hit
        this._changeFocusTimeOut
        this.moveActionName = "walk"
        this.status = "fine"
        this.focusOn = null
        this.targetRecource
        this.targDetail
        this.craftToLearn = undefined
        this.isPkMode = false

        // FOR KEYBOARD PURPOSE
        this._canpress = false
        this._enableKeyPessTimeout

        // SKILL RELATED
        this._skillReleaseTimeOut

        // Tyoes of attacks
        this._atkNum = 0
        this._meeleeNum = 0
        this._weaponAtk = "slash.0" // slash.0 slash.1
        this._meeleAtk = "meelee0" // kick // meelee0 melee1

        // sound related
        this.floorPlaces = ["guildhouse", "hl_club", "crafthouse", "apartment"]

        // ACQUIRING ITEMS
        this.timeOutForClearingLists

        // ADDITIONAL FUNCTIONS
        this.createNormalNpc = normalNpc

        this.mobileMode = false
        if(window.innerWidth >= 650){
            log("mobile mode TRUE")
            this.mobileMode = true
        }else{ log("mobile FALSE !")}

        this.main()        
    }
    updateWorldTime(){
        if(this.currentPlace.includes("dungeon")) return
        if(this.currentPlace.includes("guildhouse")) return
        if(this.currentPlace.includes("apartment")) return
        if(!hemLight) return
        if(!light) return
        if(!thePeeble) return
        if(!pLightz.length) return
        hemLight.intensity = worldTime
        let timeCap
        if(worldTime < .41){
            thePeeble.isVisible = false
            pLightz.forEach(lght => lght.intensity = 100)
            light.intensity = 0
            timeCap = "Night Time"
        }else{
            pLightz.forEach(lght => lght.intensity = 20)
            thePeeble.isVisible = true
            light.intensity = .5
            timeCap = "Day Time"
        }
        if(!isInformed){
            if(this.currentPlace.includes("room")) return 
            if(this.currentPlace.includes("dungeon")) return 
            if(this.currentPlace.includes("guild")) return 
            setTimeout(() => showNotif(timeCap, 3000), 3000)
            isInformed = true
            setTimeout(() => {
                isInformed = false
            }, 1000 * 100)
        }
    }
    noInternet(){
        noInternetCont.style.display ="flex"
        sessionStorage.removeItem("dungeonborn")
        setTimeout(()=>window.location.reload(),5000)        
    }
    setDetails(details){
        if(!details){
           return this.noInternet()
        }
        this.det = details
        this.currentPlace = details.currentPlace
  
        userId = this.det._id
        this.setMySkills()
    }
    setHTMLUI(data){
        const { sword, def, core, magic} = data.stats
        const labelsOfStats = document.querySelectorAll(".eqpd-int")
        const myApts = [];
        this.det.aptitude.forEach(apts => myApts.push(apts.name)) 
        labelsOfStats.forEach(statpwr => {
            if(statpwr.className.includes('sword')) statpwr.innerHTML = ` ${sword}`
            if(statpwr.className.includes('def')) statpwr.innerHTML = ` ${def}`
            if(statpwr.className.includes('core')) statpwr.innerHTML = ` ${core}`
            if(statpwr.className.includes('magic')) statpwr.innerHTML = ` ${magic}` 
        })
        const myStat = document.querySelector(".mystatus")
        myStat.childNodes.forEach(elem => { // HP AND MP ELEMENT
            if(elem.className && elem.className.includes('hplabel')) elem.innerHTML = `Health: ${Math.floor(data.hp)}/${data.maxHp}`
            if(elem.className && elem.className.includes('mp')) elem.innerHTML = `Mana: ${Math.floor(data.mp)}/${data.maxMp}`
            if(elem.className && elem.className.includes('sp')) elem.innerHTML = `Stamina: ${Math.floor(data.sp)}/${data.maxSp}`
            if(elem.className && elem.className.includes('exp')) elem.innerHTML = `Exp: ${Math.floor(parseInt(data.exp)/parseInt(data.maxExp) * 100)}%`
            if(elem.className && elem.className.includes('str')) elem.innerHTML = `Physical Damage: ${this.det.stats.core * this.physicalX}`
            if(elem.className && elem.className.includes('weaponDmg')) elem.innerHTML = `Plus Weapon Damage: ${this.det.stats.sword * this.weaponX} + ${this.det.weapon.name !== "none" ? this.det.weapon.plusDmg : 0}`
            if(elem.className && elem.className.includes('deftotal')) elem.innerHTML = `Body Defense: ${Math.floor(this.det.stats.def*1.5)}}`
            if(elem.className && elem.className.includes('magicDmg')) elem.innerHTML = `Magic Damage: ${Math.floor(this.det.stats.magic * this.magX)}`
            if(elem.className && elem.className.includes('speed')) elem.innerHTML = `Movement Speed: ${Math.floor(this.det.stats.spd)}`
            if(elem.className && elem.className.includes('apts')) elem.innerHTML = `Aptitudes: ${myApts.join(" || ")}`
            if(elem.className && elem.className.includes('apts')) elem.innerHTML = `Race: ${data.race}`
        })
        log(this.det.aptitude)
        let rankName = "none"
        log(this.det.rank)
        if(this.det.rank !== "none"){
            const theRank = ranks.find(ran => ran.rankDig === this.det.rank)
            rankName = theRank.displayRank
        }
        rank.innerHTML = `Rank ${rankName}`
        lvl.innerHTML = `Lvl ${this.det.lvl}`
        points.innerHTML = `points: ${data.points}`
        coin.innerHTML = `coins: ${data.coins}`
        lvlAndName.innerHTML = `lvl ${this.det.lvl} ${this.det.name}`
    }
    countActivePl(){
        plOnline.innerHTML = `players online: ${players.length}`
    }
    showScrollMess(ttle, mess){
        scrollCont.style.display = "flex"
        scrollTtle.innerHTML = ttle
        scrollMess.innerHTML = mess
        // scrollCont.children[0].style.left = `18%`
        // scrollCont.children[0].style.top = `-20px`
        // scrollCont.children[0].style.height = `50px`
        // scrollCont.children[0].style.width = `-50px`
    }
    _statPopUp(message, dura, kolur){
        let toStopTimeOut
        const popUpUI = document.querySelector(".lvl-up-message")
        // pop up msg or stat 
        setTimeout( () => {
            popUpUI.innerHTML = message
            popUpUI.style.color = kolur
            popUpUI.classList.add("lvladdon")
            setTimeout(() => popUpUI.classList.remove("lvladdon"), 1200)
        }, dura)
    }
    popItemInfo(itemDet, capName, onMiddle){
        log("pop up now")
        this._allSounds.itemEquipedS.play()
        const newBx = createElement("div", "topick-bx")
        const imgBx = createElement("div", "topick-img-bx")
        const topickCap = createElement("p", "topick-cap")
        topickCap.innerHTML = capName ? capName : 'Item drop'
        
        const theImg = createElement("img", "topick-img")
        theImg.src = `./images/loots/${itemDet.name}.png`
        const descP = createElement("p", "topick-desc", itemDet.desc)
        const btnBx = createElement("div", "topick-btns");
        const cancelBtn = createElement("div", "tp-btn", "cancel")
        const acceptItemBtn = createElement("div", "tp-btn", "accept")

        imgBx.append(topickCap)
        imgBx.append(theImg)
        newBx.append(imgBx)
        newBx.append(descP)
        btnBx.append(cancelBtn)
        btnBx.append(acceptItemBtn)
        newBx.append(btnBx)

        btnBx.addEventListener("click", async e => {
            const nameOfBtn = e.target.innerHTML
            switch(nameOfBtn){
                case "cancel":
                    newBx.style.display = "none"
                break;
                case "accept":
                    await this.addToInventory(itemDet)
                    const itemOnRec = records.find(recitm => recitm.name === itemDet.name)
                    this.obtain(itemOnRec ? itemOnRec.dn : itemDet.name,1,false)
                break
            }
            newBx.classList.add("scale-down")
        })
        
        if(!onMiddle){
            newBx.style.left = `${13 + Math.random()*40}%`
        }else{
            newBx.style.left = `50%`
        }
        
        document.body.append(newBx);
        newBx.classList.add("scale-show")
    }
    showSideNotif(parentElem, notifMessage, animName){
        sideNotif.style.display = "block"
        
        parentElem.append(sideNotif)
        sideNotif.innerHTML = notifMessage
        sideNotif.classList.add(animName)
        setTimeout(() => {
            sideNotif.style.display = "none"
            sideNotif.classList.remove(animName)
        }, 3500)
    }
    openPopUpAction(actionName){
        popupActionCont.style.display = "block"
        let btnImg
        let extns
        switch(actionName){
            case "rest":
                btnImg = 'rest' 
                extns = 'png'
            break
            case "axe":
                btnImg = 'axe' 
                extns = 'png'
            break
            case "mine":
                btnImg = 'pickaxe' 
                extns = 'png' 
            break
            case "pickup":
                btnImg = 'hand' 
                extns = 'png'
            break
            case "speak":
                btnImg = 'speak' 
                extns = 'png'
            break;
            case "key":
                btnImg = actionName
                extns = 'svg'
            break
            case "info":
                btnImg = actionName
                extns = 'svg'
            break
            case "bed":
                btnImg = actionName
                extns = 'svg'
            break;
            case "bonfire":
                btnImg = actionName
                extns = 'svg'
            break;
            default:
                btnImg = actionName
                extns = 'png'
            break
        }

        pacBtnImg.src = `./images/actions/${btnImg}.${extns}`
    }
    closePopUpAction(){
        popupActionCont.style.display = "none"
    }
    showMapName(mapName, dura){
        const mapNameLabel = document.querySelector(".map-name")
        mapNameLabel.style.display = "block"
        mapNameLabel.className.includes("remove-map") && mapNameLabel.classList.remove("remove-map")
        mapNameLabel.innerHTML = mapName

        setTimeout(() => {
            mapNameLabel.classList.add("remove-map")
            setTimeout(() => mapNameLabel.style.display="none", 1500)
        }, dura)
        this.setProperSound()
    }
    disableRightBtns(dura, isPermanent){
        rightUIBtns.forEach(btn => {
            btn.style.opacity = .5
            btn.style.pointerEvents = "none"
        })
        rightLowerUI.style.pointerEvents = "none"
        rightLowerUI.children[1].style.opacity = .5
        rightLowerUI.children[2].style.opacity = .5
        rightLowerUI.children[3].style.opacity = .5

        if(isPermanent) return
        setTimeout(() => {
            this.enableRightBtns()
        }, dura ? dura : 2000)
        
    }
    enableRightBtns(){
        rightUIBtns.forEach(btn => {
            btn.style.opacity = 1
            btn.style.pointerEvents = "visible"
        })
        rightLowerUI.style.pointerEvents = "visible"
        rightLowerUI.children[1].style.opacity = 1
        rightLowerUI.children[2].style.opacity = 1
        rightLowerUI.children[3].style.opacity = 1
    }
    changeAtkBtnImg(){
        switch(this.myChar.mode){
            case "weapon":
                log(this.det.weapon.name)
                attackImg.src = `./images/loots/${this.det.weapon.name}.png`
            break;
            case "fist":
                attackImg.src = `./images/UI/fistattack.png`
            break;
            case "stand":
                attackImg.src = `./images/UI/fistattack.png`
            break;
        }
        attackBtn.classList.add("to-spin")
        setTimeout(() => {
            attackBtn.classList.remove("to-spin")
            this.checkIfHaveWeapon()
        }, 500)
    }
    disableAttackBtn(){
        attackBtn.style.opacity = ".5"
        attackBtn.style.pointerEvents = "none"
        attackImg.style.opacity = ".4"
        attackImg.style.transform = "scale(.9)"
    }
    enableAttackBtn(){
        attackBtn.style.opacity = "1"
        attackBtn.style.pointerEvents = "visible"
        attackImg.style.opacity = ".9"
        attackImg.style.transform = "scale(1)"
    }
    disableMoving(){
        this.myChar._moving = false
        botMoving = false
        this.stopAnim(this.myChar.anims, "running")
        this.stopAnim(this.myChar.anims, "walk")
    }
    enableMoving(){
        this.myChar._moving = true
    }
    allCanPress(){
        this._canpress = true
        canPress = true
        this.setProperSound()
    }
    stopPress(stopSound){
        this._canpress = false
        canPress = false
  
        if(!this.myChar) return
        if(stopSound) this.myChar.runningS.stop();
    }
    blurButtons(btns){
        btns.forEach(btn => {
            btn.style.pointerEvents = 'none'
            btn.style.opacity = .5
        })
    }
    returnButtons(btns){
        btns.forEach(btn => {
            btn.style.pointerEvents = 'visible'
            btn.style.opacity = 1
        })
    }
    checkBody(){
        let isStillGood = true
        const hp15percent = this.det.hp <= this.det.maxHp*.10
        log(`is my life on 15% ` + hp15percent)
        
        if(hp15percent){
            isStillGood = false
            
        }
        if(this.det.survival.sleep <= 0){
            isStillGood = false
        }
    }
    getMeshHeight(mesh){
        var boundingBox = mesh.getBoundingInfo().boundingBox;

        // Get the minimum and maximum Y-coordinates of the bounding box
        var minY = boundingBox.minimumWorld.y;
        var maxY = boundingBox.maximumWorld.y;

        // Calculate the height of the mesh
        var height = maxY - minY;

        return height
    }
    getMyPos(playerBx, localT){
        const inviMesh = new BABYLON.TransformNode("transformNode", scene, false)
 
        inviMesh.parent = playerBx
        inviMesh.position = new Vector3(0,0,0)

        inviMesh.locallyTranslate(new Vector3(0,0,localT))
        const absPos = inviMesh.getAbsolutePosition()
        return absPos
    }
    async showAdventurerRecord(){
        topAdventurersCont.classList.remove("my-stat-hidding")
        const allAdventurers = await this.useFetch(`${APIURL}/characters`, "GET", this.token)
        let onlyAdventurers = []
        allAdventurers.forEach(plyrs => {
            if(plyrs.rank !== "none"){
                const plCurrPoints = plyrs.clearedQuests.currPoints
                const plCleared = plyrs.clearedQuests.totalCleared
                const {rankDig, displayRank} = ranks.find(rnks => rnks.rankDig === plyrs.rank)
                const adventurerDet = {
                    lvl: plyrs.lvl,
                    name: plyrs.name,
                    plCurrPoints,
                    plCleared,
                    rankNum: parseInt(rankDig),
                    rankDisplay: displayRank,
                    killed: plyrs.monsterKilled
                }
                onlyAdventurers.push(adventurerDet)
            }
        })
        log(onlyAdventurers)
        toplist.innerHTML = ''
        onlyAdventurers.sort(function(a, b){
            return b.rankNum-a.rankNum
        });
        let listOfAdvs = 0
        onlyAdventurers.forEach((plyrs, idx) => {
            if(listOfAdvs >= 5) return
            const bx = createElement("div", "adc-bx");
            const plName = createElement("p", "adc-name", `${idx+1}. ${plyrs.name}`)

            const infoVx = createElement("div", "adc-infobx");
            const pLvl = createElement("div", "adc-caps", `Lvl. ${plyrs.lvl}`);
            const pRank = createElement("div", "adc-caps", `Rank ${plyrs.rankDisplay}`);
            const pCleared = createElement("div", "adc-caps", `Quest Cleared: ${plyrs.plCleared}`);
            bx.append(plName)
            bx.append(infoVx)
            infoVx.append(pLvl)
            infoVx.append(pRank)
            infoVx.append(pCleared)
            toplist.append(bx)
            listOfAdvs++
        })
    
        log(onlyAdventurers)
    }
    async updateMyDetailsOL(toSave, updateLocal){
        try {
            const data = await this.useFetch(`${APIURL}/characters/updateall/${toSave._id}`, "PATCH", this.token, toSave)
            updateLocal && this.setDetails(data)
        } catch (error) {
            log(error)   
        }
    }
    async addToInventory(itemDet){
        const data = await this.useFetch(`${APIURL}/characters/additem/${this.det.owner}`, "PATCH", this.token, itemDet)
        log('added to inventory')

        this.det.items = data.items
        log(this.det.items)
        // this.setDetails({...this.det, hp: this.det.hp, sp: this.det.sp, mp: this.det.mp})
    }
    async obtain(itemName, qnty, willSave){
        clearTimeout(this.timeOutForClearingLists)
        acquiredLists.style.display = "block"
        
        setTimeout(() => {
            const pElem = createElement("p", "float-up", `acquired ${itemName} x${qnty}`)
            acquiredLists.append(pElem);
            if(itemName.includes("coin")) return this._allSounds.coinReceivedS.play()
            this._allSounds.itemEquipedS.play()
        }, 500)

        this.timeOutForClearingLists = setTimeout(() => {
            acquiredLists.innerHTML = ''
            acquiredLists.style.display = "none"
        }, 5000);

        if(!willSave) return
        const theItem = records.find(record => record.name === itemName)
        if(!theItem) log("Item not found on record")
        const {name, itemType, origPrice} = theItem
        const toAdd = {
            name,
            itemType,
            meshId: makeRandNum(), 
            qnty: 1,
            price: origPrice
        }
        const data = await this.useFetch(`${APIURL}/characters/additem/${this.userId}`, "PATCH", this.token, toAdd)
        if(!data) return log("problem updating inventory")
        this.setDetails({...data, hp: this.det.hp, sp: this.det.sp, mp: this.det.mp})
    }
    async obtainScroll(){
        clearTimeout(this.timeOutForClearingLists)
        acquiredLists.style.display = "block"

        const pElem = createElement("p", "float-up", `acquired scroll x1`)
        acquiredLists.append(pElem)

        this.timeOutForClearingLists = setTimeout(() => {
            acquiredLists.innerHTML = ''
            acquiredLists.style.display = "none"
        }, 3000)

        const toAdd = {
            name: this.targDetail.name,
            itemType: 'scroll',
            meshId: makeRandNum(),
            qnty: 1,
            price: 0
        }
        log(toAdd)
        const data = await this.useFetch(`${APIURL}/characters/additem/${this.userId}`, "PATCH", this.token, toAdd)
        if(!data) return log("problem updating inventory")
        this.setDetails({...data, hp: this.det.hp, mp: this.det.mp, sp: this.det.sp})
    }
    async deductItem(meshId, qnty){
        const data = await this.useFetch(`${APIURL}/characters/deductitem/${this.myChar._id}`, "PATCH", this.token, {meshId, qnty})
        if(!data) return log("problem updating inventory or item not found in database")
        // this.setDetails({...data, hp: this.det.hp, sp: this.det.sp, mp: this.det.mp})
        this.det.items = data.items
        log(data)
        this.setInventory("recource")
    }
    async upgrade(statName){
        let data = await this.getCharacDetailsOnline()
 
        if(data.points <= 0) return log("not enough points")
        this._allSounds.upgradeS.play()
        switch (statName) {
            case 'sword':
                data.stats.sword += 1
            break;
            case 'def':
                data.stats.def += 1
            break;
            case 'core':
                data.stats.core += 1
                data.maxHp += 40
                data.maxMp += 20
                data.maxSp += 20
            break;
            case 'magic':
                data.stats.magic += 1
            break;
        }
        data.points -= 1
        this.blurButtons(upgradeBtns)
        await this.updateMyDetailsOL({...data, hp: this.det.hp, mp: this.det.mp, sp: this.det.sp}, false)
        this.det = data
        this.setHTMLUI(this.det)
        this.returnButtons(upgradeBtns)
    }
    increaseStat(){
        this.det.maxExp += this.det.maxExp/3

        this.det.points +=1
        this.det.lvl += 1
        this.det.hp = this.det.maxHp
        this.det.mp = this.det.maxMp
        this.det.sp = this.det.maxSp
    }
    async expGain(exp){
        let excessExp = 0
        this.det.exp += parseInt(exp)
        log(`exp gained is ${exp}`)
        log(`my current exp ${this.det.exp}`)
        log(`my max exp is ${this.det.maxExp}`)
        if(this.det.exp >= this.det.maxExp){
            excessExp = this.det.exp - this.det.maxExp

            this.increaseStat()
            log(`my excess is ${excessExp} maxExp is ${this.det.maxExp}`)
            if(excessExp > this.det.maxExp){
                while(excessExp > this.det.maxExp){
                    log(`excess higher is ${excessExp}`)
                    excessExp -= this.det.maxExp
                    log(`excess exp after deduct ${excessExp} maxEXP now ${this.det.maxExp}`)
                    this.increaseStat()
                }
            }
            this.det.exp = excessExp
            await this.updateMyDetailsOL(this.det, true)
            this.showTransaction(`Level Raised To ${this.det.lvl}`, 1500)
            this._allSounds.congratsS.play()
            log("Updated online")
            this.setHTMLUI(this.det)
            return log(this.det)
        }
        this.setHTMLUI(this.det)
        // this.blurButtons(upgradeBtns)
        // await this.updateMyDetailsOL(data, false)
        // this.returnButtons(upgradeBtns)     
    }
    willBow(){
        this.stopPress()
        closeGameUI()
        this.myChar.mode = "none"
        this.playAnim(this.myChar.anims, "willbow", true)
    }
    willHeadLoading(maxLoad, callBackIfFinish){
        this.myLoadingBarMin = 0
        this.myLoadingBarMax = maxLoad
        this.myBar.outlineBar.width = `${this.myLoadingBarMax}px`;
        this.myBar.barMesh.isVisible = true

        clearInterval(this.intervalUntilFull)
        this.intervalUntilFull = setInterval(() =>{
            if(this.myLoadingBarMin >= this.myLoadingBarMax){
                this.myBar.barMesh.isVisible = false
                this.allCanPress()
                callBackIfFinish()
                return clearInterval(this.intervalUntilFull)
            }
            this.myLoadingBarMin+=4
            this.myBar.bar.width = `${this.myLoadingBarMin}px`

        } , this.openingSpd);
    }
    sendMessage(name, mess){
        const toSend = {
            _id: this.det._id,
            name: name,
            message: mess,
            place: this.currentPlace
        }
        this.socketAvailable && this.socket.emit('sendto-world',toSend)
    }
    createMessage(data){
        if(!this.socketAvailable) return log("multiplayer off")
        const plBx = createElement('div', 'pl-bx')
        const plName = createElement('p', 'pl-name', `${data.name} (${data.place})`)
        const plMess = createElement('p', 'pl-message', `${data.message}`)
        plBx.append(plName)
        plBx.append(plMess)
        chatList.append(plBx)
    }
    openScroll(){
        this._allSounds.openingScrollS.attachToMesh(this.myChar.bx)
        this._allSounds.suspense1.attachToMesh(this.myChar.bx)
        this._allSounds.suspense2.attachToMesh(this.myChar.bx)
        this._allSounds.openingScrollS.play()
        this._allSounds.suspense1.play()
        this._allSounds.suspense2.play(1)
        scrollChoiceCont.style.pointerEvents = "visible"
        scrollChoiceCont.style.display = "block"
        scrlLeft.classList.remove("scrl-close-left")
        scrlRight.classList.remove("scrl-close-right")
        scrlLeft.classList.remove("scrl-to-left")
        scrlRight.classList.remove("scrl-to-right")
        scrlLeft.classList.add("scrl-to-left")
        scrlRight.classList.add("scrl-to-right")
        closeGameUI()
        setTimeout(() => {
            scrollList.classList.add("scrl-show")
        }, 500)
        scrollList.innerHTML = '';
    }
    closeScroll(){
        this._allSounds.suspense2.stop()
        this._allSounds.openingScrollS.play()
        scrollChoiceCont.style.pointerEvents = "none"
        scrollList.classList.remove("scrl-show")
        setTimeout(() => {
            scrlLeft.classList.remove("scrl-close-left")
            scrlRight.classList.remove("scrl-close-right")
            scrlLeft.classList.add("scrl-close-left")
            scrlRight.classList.add("scrl-close-right")
            setTimeout(() => {
                scrollChoiceCont.style.display = "none"
                scrollList.classList.remove("scrl-show")
            }, 900)
            
        }, 300)
    }
    showTransaction(text, timeOutSec){
        const transMess = document.querySelector(".transaction-message")
        transMess.innerHTML = text
        transMess.classList.remove("trans-close")

        if(timeOutSec) setTimeout(() => transMess.classList.add("trans-close"), timeOutSec)
    }
    setMode(modeName, dura){
        this._allSounds.changeModeS.play()
        setTimeout(() =>{
            this.myChar.mode = modeName
            myCharDet.mode = modeName
            this.socketAvailable && this.socket.emit("changeMode", {
                _id: this.det._id,
                mode: modeName
            })
            this.checkSkillModes()
        }, dura)
    }
    closeRedUI(){
        apartCont.style.display = "none"
        apartInfos.style.display = "flex"
        aprtLoadingBx.style.display ="none"
    }
    openBlessings(blessings, speechAfterChoosing, cb){
        const blessingCont = document.querySelector(".blessings-cont");
        blessingCont.style.display = "flex"
        blessingCont.innerHTML = ''
        blessings.forEach(bls => {
            const newBx = createElement("div", "bless-bx")
            const newImg = createElement("img", "bless-img")
            newImg.src = `./images/blessings/${bls.name}.png`
            const blessingTtle = createElement("p", "bless-ttle", bls.dn)
            const blessingDesc = createElement("p", "bless-desc", bls.desc)
            blessingTtle.style.color = bls.kolur
            newBx.append(newImg)
            newBx.append(blessingTtle)
            newBx.append(blessingDesc)
            blessingCont.append(newBx)

            newBx.addEventListener("click", async () => {
                const isAlreadyHave = this.det.blessings.some(blsing => blsing.name === bls.name)
                if(isAlreadyHave) return alert("blessing already have")
                this.det.blessings.push({name: bls.name, dn: bls.dn, desc: bls.desc})
                this.det.storyQue = this.det.storyQue.filter(stryQ => stryQ !== "wakingUp")
                const toSave = bls.activate(this.det)
                blessingCont.style.pointerEvents = "none"
                this.transCloseElem(newBx, 2000);
                document.querySelectorAll(".bless-bx").forEach(elmBx => {
                    elmBx.style.pointerEvents = "none"
                    this.transCloseElem(elmBx, 2000);
                })
                let theColorIdx
                switch(bls.name){
                    case 'undying':
                        theColorIdx = 0
                    break
                    case 'oblivion':
                        theColorIdx = 1
                    break
                    case 'warbeast':
                        theColorIdx = 2
                    break
                }
                const thePos = this.getMyPos(this.myChar.bx, -.7)
                this.createNewCircle(rgbColors[theColorIdx].rgb, {x: 3.14159/2, y: 0,z:0}, {x: thePos.x, y: 1.4, z: thePos.z}, this.det._id, 500)
                await this.updateMyDetailsOL(toSave, true);
                setTimeout(() => {
                    this.continuesSpeech(speechAfterChoosing, 0, 2000, cb ? cb : undefined)
                    blessingCont.style.pointerEvents = "visible"
                    this.transCloseElem(blessingCont, 2000)
                }, 1000)
            })
        })
    }
    transCloseElem(elem, dura){
        elem.classList.add("transClose")
        setTimeout(() => {
            elem.style.display = "none"
            elem.classList.remove("transClose")
        },dura)
    }
    setQuestions(questions, ttle, cb){
        
        questionCont.innerHTML = ''
        questionCont.style.display = "flex"
        questionCont.classList.remove("transClose")
        if(ttle){
            const theTtle = createElement("p", "questionTtle", ttle)
            questionCont.append(theTtle)
        }
        questions.forEach(qstion => {
            const newP = createElement("p", "question", `${qstion.dn}`)

            newP.addEventListener("click", e => {
                cb(qstion)
            })
            questionCont.append(newP)
        })
    }
    setCraftOrFixing(ttle, itemType, categ){
        const ironElem = document.querySelector(".cmc-t-iron")
        const coinElem = document.querySelector(".cmc-t-coin")
        const requireIronCap = document.querySelector(".cmc-req-cap")
        const insuffCap = document.querySelector(".cmc-lack-notif")
        const craftTypeSelect = document.querySelector(".craft-type")

        insuffCap.style.display = "none"
        compatibleCont.style.display = "flex"
        compatibleCont.classList.remove("transClosePopUp")
        requireIronCap.innerHTML = `requires iron x${0}`
        craftCost.innerHTML = `x${0}`
        this.blurButtons([craftWeaponBtn])

        ttleOfItemsDisplay.innerHTML = ttle
        compatibleItemList.innerHTML = ''
        let lengthOfItemInside = 0;
        let myIron = this.det.items.find(itmdet => itmdet.name === "iron");
        if(!myIron) myIron = { qnty: 0 }
        ironElem.innerHTML = `total irons: ${myIron.qnty}`
        coinElem.innerHTML = this.det.coins
        this.det.items.forEach(itm => {
            switch(categ){
                case "craftNewWeapon":
                    craftTypeSelect.style.display = "block"
                    if(itm.itemType === itemType){
                        lengthOfItemInside++
                        if(lengthOfItemInside >= 5) compatibleItemList.style.overflowY = "scroll"
                        const theItem = records.find(rec =>rec.name === itm.name)
                        const newLi = createElement("li", "cmc-li")
                        const itmImg = createElement("img", "cmc-itmimg")
                        itmImg.src = `./images/loots/${itm.name}.png`
                        const itmName = createElement("p", "cmc-itmname", `${theItem.dn} <span class="cmc-qnty">${itm.qnty}</span>`)
                        newLi.append(itmImg)
                        newLi.append(itmName)
                        compatibleItemList.append(newLi)
                        newLi.addEventListener("click", e => {
                            const weaponResults = []
                            records.forEach(recItm => {                                
                                if(recItm.craftMaterial?.name === itm.name 
                                && recItm.itemType === craftTypeSelect.value
                                && recItm.craftMaterial?.forgeChance > 0) weaponResults.push(recItm)
                            })
        
                            document.querySelectorAll(".cmc-li").forEach(elem => {
                                if(elem.className.includes("cmc-active")) elem.classList.remove("cmc-active")
                            })
                            newLi.classList.add("cmc-active")
                            if(!weaponResults.length){
                                insuffCap.style.display = "block"
                                return insuffCap.innerHTML = `item cannot be craft`
                            }
                            const weaponToCraft = weaponResults[Math.floor(Math.random()*weaponResults.length)]
                            
                            let costForCraft = 0
                            let ironCost = 0
                            switch(itm.name){
                                case "mincore":
                                    costForCraft = 700
                                    ironCost = 5
                                break
                                case "vipcore":
                                    costForCraft = 2000
                                    ironCost = 5
                                break
                                default:    
                                    costForCraft = 100
                                    ironCost = 3
                                break;
                            }
                
                            requireIronCap.innerHTML = `requires iron x${ironCost}`
                            craftCost.innerHTML = `x${costForCraft}`
                            this.blurButtons([craftWeaponBtn])
                            if(weaponToCraft.craftMaterial.qnty > itm.qnty){
                                insuffCap.style.display = "block"
                                return insuffCap.innerHTML = `insufficient core, requires x${weaponToCraft.craftMaterial.qnty}`
                            }
                            if(myIron.qnty < ironCost){
                                insuffCap.style.display = "block"
                                return insuffCap.innerHTML = `insufficient iron, requires x${ironCost}`
                            }
                            if(this.det.coins < costForCraft){
                                insuffCap.style.display = "block"
                                return insuffCap.innerHTML = `insufficient coins, requires x${costForCraft}`
                            }
                            insuffCap.style.display = "none"
                            craftWeaponBtn.innerHTML = `Request Craft
                            <img src="./images/UI/coins.png" alt="" class="cmc-coinimg">
                            <span class="cmc-cost">x${costForCraft}</span>`
                            this.craftFunc = async function(){
                                this.det.coins-=costForCraft
                                // first deduct some iron
                                await this.deductItem(myIron.meshId, ironCost)
                                // then deduct the cores
                                await this.deductItem(itm.meshId, weaponToCraft.craftMaterial.qnty)
                                this.popItemInfo({...weaponToCraft, meshId: makeRandNum(), price: weaponToCraft.secondPrice, qnty: 1 }, weaponToCraft.dn, true)
                            }
                            this.returnButtons([craftWeaponBtn])                        
                        })
                    }
                break
                case "fixEnhanceItem":
                    craftTypeSelect.style.display = "none"
                    const itemCategs = ["helmet", "armor","gear", "sword", "shield"]
                    const isFixable = itemCategs.some(itemc => itemc === itm.itemType)
                    if(!isFixable) return
      
                    const theItem = records.find(rec =>rec.name === itm.name)
                    if(theItem.craftMaterial?.forgeChance === 0) return log(`${itm.name} is not capable for fixing enhancing`)
                    if(itm.name === this.det.weapon.name) return log(itm.name + " is equiped")
                    if(itm.name === this.det.armor.name) return log(itm.name + " is equiped")
                    if(itm.name === this.det.shield.name) return log(itm.name + " is equiped")
                    if(itm.name === this.det.helmet.name) return log(itm.name + " is equiped")
                    if(itm.name === this.det.gear.name) return  log(itm.name + " is equiped")
                    lengthOfItemInside++
                    if(lengthOfItemInside >= 5) compatibleItemList.style.overflowY = "scroll"
                    
                    const newLi = createElement("li", "cmc-li")
                    const itmImg = createElement("img", "cmc-itmimg")
                    itmImg.src = `./images/loots/${itm.name}.png`

                    const percentFix = itm.cState/itm.durability * 100
                    const itmDuraElem = createElement("p", `cmc-duracap ${percentFix <= 25 && "cmc-red"}`, `durability: ${Math.floor(percentFix)}%`)
                    const itmName = createElement("p", "cmc-itmname", `${theItem.dn}`)
                    newLi.append(itmImg)
                    newLi.append(itmDuraElem)
                    newLi.append(itmName)
                    compatibleItemList.append(newLi)
                    
                    newLi.addEventListener("click", e => {
                        document.querySelectorAll(".cmc-li").forEach(elem => {
                            if(elem.className.includes("cmc-active")) elem.classList.remove("cmc-active")
                        })
                        newLi.classList.add("cmc-active")
                        let costForCraft = 0
                        let ironCost = 0
                        let successChance = 0
                        const itemRec = records.find(rec => rec.name === itm.name)
                        log("core material " + itemRec.craftMaterial.name)
                        switch(itemRec.craftMaterial.name){
                            case "mincore":
                                costForCraft = 800
                                ironCost = 4
                                successChance = 6
                            break
                            case "vipcore":
                                costForCraft = 2000
                                ironCost = 5
                                successChance = 5
                            break;
                            default:    
                                costForCraft = 400
                                ironCost = 3
                                successChance = 7
                            break;
                        }
            
                        requireIronCap.innerHTML = `requires iron x${ironCost}`
                        craftCost.innerHTML = `x${costForCraft}`
                        this.blurButtons([craftWeaponBtn])
                        // FIX THE ITEM 
                        if(myIron.qnty < ironCost){
                            insuffCap.style.display = "block"
                            return insuffCap.innerHTML = `insufficient iron, requires x${ironCost}`
                        }
                        if(this.det.coins < costForCraft){
                            insuffCap.style.display = "block"
                            return insuffCap.innerHTML = `insufficient coins, requires x${costForCraft}`
                        }
                        insuffCap.style.display = "none"
                        craftWeaponBtn.innerHTML = `Enhance & Fix 
                        <img src="./images/UI/coins.png" alt="" class="cmc-coinimg">
                        <span class="cmc-cost">x${costForCraft}</span>`
                        this.craftFunc = async function(){
                            this.showTransaction("Fixing And Enhancing ....", false)
                            this.det.coins-=costForCraft
                            // first deduct some iron
                            await this.deductItem(myIron.meshId, ironCost)

                            if((Math.random()*10) >= successChance) {
                                this._allSounds.brokenS.play()
                                return this.showTransaction("Item Failed To Enhance", 3500)
                            }

                            const theItemToFix = this.det.items.find(myItm => myItm.meshId === itm.meshId)
                            log('before enhance ', theItemToFix)
                            theItemToFix.durability += theItemToFix.durability/3
                            theItemToFix.cState = theItemToFix.durability
                            switch(theItemToFix.itemType){
                                case "sword":
                                    theItemToFix.plusDmg += Math.floor(theItemToFix.plusDmg/4)
                                break;
                                default:
                                    // for now default is armor so plusDef
                                    theItemToFix.plusDef += Math.floor(theItemToFix.plusDef/4)
                                break
                            }
                            log('after enhance ', theItemToFix)
                            // no need to update my this.det.weapon or det.armor because you cannot see
                            // the item in the box if you didnt unequip them
 
                            await this.updateMyDetailsOL(this.det, true);
                            this.showTransaction("Successfully Enhanced", 3500)
                            this._allSounds.itemEquipedS.play();
                            log(this.det.items)
                        }
                        this.returnButtons([craftWeaponBtn])
                    
                    })
                    if(lengthOfItemInside === 0){
                        insuffCap.style.display = "block"
                        insuffCap.innerHTML = `No item in inventory, Unequip Armor Or Weapon`
                    }
                break
            }
        })
        if(!lengthOfItemInside){
            const pNoItemCap = createElement("div", "cmc-itmname", `<p style="color:#f5f5f5;">You Have No Items For Craft</p>`)
            compatibleItemList.append(pNoItemCap)
        }
    }
    setSellItems(items, toAvoids){
        shopChoiceCont.style.display = "flex"
        shopList.innerHTML = ''
        shopCateg.innerHTML = 'My Items To Sell'
        items.forEach(item => {
            if(item.itemType === 'seed') return
            if(item.name === this.det.weapon.name) return
            if(item.name === this.det.armor.name) return
            if(item.name === this.det.gear.name) return
            if(item.name === this.det.shield.name) return
            if(item.name === this.det.helmet.name) return

            const isToAvoid = toAvoids.some(itm => itm === item.itemType)
            if(isToAvoid) return
            const newDiv = createElement('div', 'shopbx')
            const newImg = createElement('img', 'shop-img')
            newImg.src = `./images/loots/${item.name}.png`
            newDiv.append(newImg)
            const itemRec = records.find(rec => rec.name === item.name)
            if(!itemRec) return log("not found item on records")
            const itemName = createElement('p', 'shopitem-name', itemRec.dn)
            newDiv.append(itemName)
            const itmQnty = createElement("p", 'shopitm-qnty', `x${item.qnty}`)
            newDiv.append(itmQnty)
            const pricebtn = createElement("button", "shopitem-btn", `sell ${item.price}`, async () => {
                await this.deductItem(item.meshId, 1)
                this.det.coins+=parseInt(item.price)
                await this.updateMyDetailsOL(this.det)
                this._allSounds.coinReceivedS.play()              
                this.showTransaction(`${item.name} Successfully Sold`, 1600)
                this.setSellItems(this.det.items, toAvoids)          
            })
            newDiv.append(pricebtn)
            if(item.qnty > 1){
                const totalAllPrice = item.price*item.qnty
                const sellAllBtn = createElement("button", "shopitem-btn", `sell All ${totalAllPrice}`, async () => {
                    await this.deductItem(item.meshId, item.qnty)
                    this.det.coins+=parseInt(totalAllPrice)
                    await this.updateMyDetailsOL(this.det, true)
                    this._allSounds.coinReceivedS.play()              
                    this.showTransaction(`${item.name} Successfully Sold`, 1600)
                    this.setSellItems(this.det.items, toAvoids)          
                })
                newDiv.append(sellAllBtn)
            }
            shopList.append(newDiv)
        })
    }
    setToBuyItems(items){
        shopChoiceCont.style.display = "flex"
        shopList.innerHTML = ''
        shopCateg.innerHTML = `My coins: ${Math.floor(this.det.coins)}`
        items.forEach(item => {
            const newDiv = createElement('div', 'shopbx')
            const newImg = createElement('img', 'shop-img')
            newImg.src = `./images/loots/${item.name}.png`
            newDiv.append(newImg)
            const itemName = createElement('p', 'shopitem-name', item.dn)
            newDiv.append(itemName)
            let itemDmg
            switch (item.itemType) {
                case 'sword':
                    itemDmg = createElement('p', 'shopitem-dmgDef', `+${item.plusDmg} dmg`)
                    newDiv.append(itemDmg)
                break;
                case 'armor':
                    itemDmg = createElement('p', 'shopitem-dmgDef', `+${item.plusDef} def`)
                    newDiv.append(itemDmg)
                break;
                case 'helmet':
                    itemDmg = createElement('p', 'shopitem-dmgDef', `+${item.plusDef} def`)
                    newDiv.append(itemDmg)
                break;  
                case 'gear':
                    itemDmg = createElement('p', 'shopitem-dmgDef', `+${item.plusDef} def`)
                    newDiv.append(itemDmg)
                break;  
                case 'shield':
                    itemDmg = createElement('p', 'shopitem-dmgDef', `+${item.plusDef} def`)
                    newDiv.append(itemDmg)
                break;  
                default:
                break;
            }
            const pricebtn = createElement("button", "shopitem-btn", item.price, async () => {
                const theItemRec = records.find(itm => itm.name === item.name)
                const toSave = {...theItemRec, meshId: makeRandNum(), qnty: 1, price: theItemRec.secondPrice}
                if(item.price > this.det.coins) return this.showTransaction("Not Enough Coins", 800)
                shopList.classList.add("cannot-click")
                this.showTransaction(`Buying ${theItemRec.dn} ...`, false)
                log("can buy this " + toSave.name)
                this.det.coins-=parseInt(item.price)
                pricebtn.innerHTML = 'Loading...'
                pricebtn.style.pointerEvents = "none"
                await this.updateMyDetailsOL(this.det)
                await this.addToInventory(toSave)
                this._allSounds.itemEquipedS.play() 
                this.showTransaction(`${item.name} added to Inventory !`, 1600)
                shopCateg.innerHTML = `My coins: ${this.det.coins}`
                pricebtn.innerHTML = item.price
                pricebtn.style.pointerEvents = "visible"
                if(shopList.className.includes("cannot-click")) shopList.classList.remove("cannot-click")
            })
            newDiv.append(pricebtn)
            shopList.append(newDiv)
        })
    }
    setInventory(categName){
        invList.innerHTML = ''
 
        this.det.items.forEach(item => {
            const theItem = createElement('div', 'item')
            theItem.id = item.meshId
            const qntylbl = createElement('p', 'qnty-label')
            qntylbl.innerHTML = item.qnty

            const theItemImg = createElement("img", 'item-img')
            theItemImg.src = `./images/loots/${item.name}.png`
            
            switch(item.itemType){
                case "sword":
                    qntylbl.style.display = "none"
                    if(item.meshId === this.det.weapon.meshId){
                        theItem.style.opacity = ".5"
                        theItem.style.pointerEvents = "none"
                        theItem.style.border = "2px solid crimson"
                    } 
                break
                case "helmet":
                    qntylbl.style.display = "none"
                    if(item.meshId === this.det.helmet.meshId){
                        theItem.style.opacity = ".5"
                        theItem.style.pointerEvents = "none"
                        theItem.style.border = "2px solid crimson"
                    } 
                break;
                case "shield":
                    qntylbl.style.display = "none"
                    if(item.meshId === this.det.shield.meshId){
                        theItem.style.opacity = ".5"
                        theItem.style.pointerEvents = "none"
                        theItem.style.border = "2px solid crimson"
                    } 
                break
                case "armor":
                    qntylbl.style.display = "none"
                    if(item.meshId === this.det.armor.meshId){
                        theItem.style.opacity = ".5"
                        theItem.style.pointerEvents = "none"
                        theItem.style.border = "2px solid crimson"
                    } 
                break
                case "gear":
                    qntylbl.style.display = "none"
                    if(item.meshId === this.det.gear.meshId){
                        theItem.style.opacity = ".5"
                        theItem.style.pointerEvents = "none"
                        theItem.style.border = "2px solid crimson"
                    } 
                break
                case "seed":
                    item.itemType === "seed"
                    theItemImg.src = `./images/loots/seed.png`
                break;
                case "scroll":
                    theItemImg.src = `./images/loots/scroll.png`
                break;
                default:
                    theItemImg.src = `./images/loots/${item.name}.png`
                break
                
            }
            theItem.append(theItemImg)
            theItem.append(qntylbl)
            invList.append(theItem)
        })
    }
    setEquipedItems(){
        const forWeapon = equipedItemsCont.children[0];
        const forShield = equipedItemsCont.children[1];
        const forHelmet = equipedItemsCont.children[2];
        const forArmor = equipedItemsCont.children[3];
        const forGear = equipedItemsCont.children[4];
        this._allSounds.itemEquipedS.play()
        const noName = (chld, imgName) => {
            if(chld.className === "none-cap") chld.style.display = "block";
            if(chld.className === "arm-det") chld.style.display = "none";
            if(chld.className === "arms-bx"){
                chld.children[0].src = `./images/setup/armorui/${imgName}.svg`
                chld.children[0].style.filter = 'invert(1)'
                chld.children[0].style.opacity = '.5'
                chld.setAttribute("id", "noequiped")
            }
        }
        const itemAvailable = (det, chld) => {
            log(det.name)
            if(chld.className === "none-cap") chld.style.display = "none";
            if(chld.className === "arms-bx"){
                chld.children[0].src = `./images/loots/${det.name}.png`
                chld.children[0].style.filter = 'invert(0)'
                chld.children[0].style.opacity = '1'
                chld.setAttribute("id", det.name);
            }
            if(chld.className === "arm-det"){
                chld.style.display = "block";
                const {plusDef, cState, durability, plusDmg, itemType} = det
                let toWrite = ''
                switch(itemType){
                    case "sword":
                        toWrite = `damage <span class="a-s">+${plusDmg}</span>`
                    break
                    case "armor":
                        toWrite = `defense <span class="a-s">+${plusDef}</span>`
                    break
                    case "helmet":
                        toWrite = `defense <span class="a-s">+${plusDef}</span>`
                    break
                    case "gear":
                        toWrite = `gear defense <span class="a-s">+${plusDef}</span>`
                    break;
                    case "shield":
                        toWrite = `defense <span class="a-s">+${plusDef}</span>`
                    break
                }
                //log("itemtype " + itemType)
                chld.children[0].innerHTML = toWrite;
                const percentOfDur = (cState/durability) * 100
                let color = percentOfDur < 20 ? "crimson" : "limegreen"
                const theWidth = `${Math.floor(percentOfDur) <= 0 ? 1 : Math.floor(percentOfDur)}%`
                log(cState)
                log(durability)
                log(percentOfDur)
                chld.children[2].children[0].style.width = theWidth
                log(theWidth)
                chld.children[2].children[0].style.background = color
            }
        }
        forWeapon.childNodes.forEach(chld => {
            if(chld.className === undefined) return
            if(this.det.weapon.name === "none"){
                noName(chld, "blade")
            }else{
                const theItem = this.det.items.find(itm => itm.meshId === this.det.weapon.meshId)
                if(!theItem) return log("my equiped weapon not found");
                itemAvailable(theItem, chld)
            }
        })
        forShield.childNodes.forEach(chld => {
            if(chld.className === undefined) return
            if(this.det.shield.name === "none"){
                noName(chld, "shield")
            }else{
                const theItem = this.det.items.find(itm => itm.meshId === this.det.shield.meshId)
                if(!theItem) return log("my equiped weapon not found");

                itemAvailable(theItem, chld)
            }
        })
        forHelmet.childNodes.forEach(chld => {
            if(chld.className === undefined) return
            if(this.det.helmet.name === "none"){
                noName(chld, "helmet")
            }else{
                const theItem = this.det.items.find(itm => itm.meshId === this.det.helmet.meshId)
                if(!theItem) return log("my equiped weapon not found");

                itemAvailable(theItem, chld)
            }
        })
        forArmor.childNodes.forEach(chld => {
            if(chld.className === undefined) return
            if(this.det.armor.name === "none"){
                noName(chld, "armor")
            }else{
                const theItem = this.det.items.find(itm => itm.meshId === this.det.armor.meshId)
                if(!theItem) return log("my equiped weapon not found");
                itemAvailable(theItem, chld)
            }
        })
        forGear.childNodes.forEach(chld => {
            if(chld.className === undefined) return
            if(this.det.gear.name === "none"){
                noName(chld, "boots")
            }else{
                const theItem = this.det.items.find(itm => itm.meshId === this.det.gear.meshId)
                if(!theItem) return log("my equiped weapon not found");

                itemAvailable(theItem, chld)
            }
        })
    }
    unEquip(itemInfo, isDropping){
        switch(itemInfo.itemType){
            case "armor":
                this.hideMesh(this.myChar.armorz, itemInfo.name);
                this.det.armor.name = "none"
                this.det.armor.meshId = "none"
            break;
            case "sword":
                this.hideMesh(this.myChar.swordz, itemInfo.name);
                log(this.myChar.swordz)
                this.det.weapon.name = "none"
                this.det.weapon.meshId = "none"
                throwBtn.style.display = "none"
                swordPicBtn.style.display ="none"
                if(this.myChar.mode === "weapon" || isDropping){
                    this.myChar.mode = "fist"
                    this.keepSword(this.myChar.rootSword, this.myChar.rootBone)
                    this.changeAtkBtnImg()
                    this.hideAllSword(this.myChar.swordz)
                }
            break
            case "helmet":
                this.hideMesh(this.myChar.myhelmetz, itemInfo.name);
                this.det.helmet.name = "none"
                this.det.helmet.meshId = "none"

            break;
            case "gear":
                this.hideMesh(this.myChar.gearz, itemInfo.name);
                this.det.gear.name = "none"
                this.det.gear.meshId = "none"
            break
            case "shield":
                this.hideMesh(this.myChar.myshieldz, itemInfo.name);
                this.det.shield.name = "none"
                this.det.shield.meshId = "none"
            break
        }
        this.setEquipedItems()
        this.setInventory()
        itemInfoCont.style.display = "none"
        this.socketAvailable && this.socket.emit("unequip", {_id: this.det._id, itemName:itemInfo.name,itemType: itemInfo.itemType})
    }
    checkItemsForQuest(questType){
        this.det.items.forEach(itm => {
            this.readCheckMyQuest(questType, itm, undefined)
        })
    }
    cancelCraft(){
        toCraftCont.style.display = "none"
        craftCont.style.display = "none"
        if(this.toDropMesh){
            this.toDropMesh.dispose()
            this.toDropMesh = undefined;
        }
        this.canDropHere = true;
        this.craftFunc = undefined
        this.myChar._crafting = false
    }
    disposeMeeleeMesh(collisionForEnemy, dura){
        if(dura){
            setTimeout(() => {
                collisionForEnemy.parent = null
                collisionForEnemy.position.y = 100
                collisionForEnemy.dispose();
            }, dura)
        }else{

            collisionForEnemy.parent = null
            collisionForEnemy.position.y = 100
            collisionForEnemy.dispose();

        }
    }
    disposeMeshes(arrayOfMesh, dura){
        setTimeout(() => {
            arrayOfMesh.forEach(mesh => mesh && mesh.dispose())
        }, dura ? dura : 0)
    }
    disposeSounds(soundsArray, disposeAfterDura){
        if(disposeAfterDura){
            setTimeout(() => {
                soundsArray.forEach(sound => sound && sound.dispose())
            }, disposeAfterDura)
        }else{
            soundsArray.forEach(sound => sound && sound.dispose())
        }
    }
    setAttachSound(skillName, soundNameAndId, attachTo, willPlay){
        let theSound = this._scene.getSoundByName(soundNameAndId)
        if(!theSound){
            log("no sound made with this")
            switch (skillName) {
                case "fireBall":
                    theSound = this._allSounds.fireBall.clone(soundNameAndId)
                break;
                case "superPunch":
                    theSound = this._allSounds.superPunched.clone(soundNameAndId)
                break
                case "spinningStar":
                    theSound = this._allSounds.fireBall.clone(soundNameAndId)
                break;
                default:
                break;
            }
            
            theSound.attachToMesh(attachTo)
            willPlay && theSound.play();
        }else{
            log("this user already have so no need to make")
            willPlay && theSound.play()
        }

        return theSound
    }
    logicWhenMonsterIsHit(player, mons, monsFos, pFos, physicalDmg, skillDmg){
        if(player._id === this.det._id){
            if(this.socketAvailable){
                this.socket.emit("monsterIsHit", {monsId: mons.monsId, dmgTaken: physicalDmg + skillDmg, _id: player._id,
                    pos: {x: monsFos.x, z: monsFos.z}, mypos: {x: pFos.x, z: pFos.z}, mode: player.mode, isCritical: true })
            }else{
                this.monsterIsHit(mons.monsId, player.bx.position, player._id,physicalDmg + skillDmg, monsFos, "fist", true)
            }
        }else{
            this.monsterIsHit(mons.monsId, player.bx.position, player._id,physicalDmg + skillDmg, monsFos, "fist", true)
        }
    }
    disposeActionM(mesh){
        if(mesh.actionManager){
            mesh.actionManager.dispose()
            mesh.actionManager = null
        }
    }
    makeExplosive(theSound, explodeParticle, theBody, soundDisposeTime, particleWillDisposeOnStop, targetStopDura){
        // sound
        theSound.attachToMesh(theBody)
        theSound.play()
        this.disposeSounds([theSound], soundDisposeTime)
        // particle
        explodeParticle.emitter = theBody                           
        explodeParticle.disposeOnStop = particleWillDisposeOnStop
        if(targetStopDura) explodeParticle.targetStopDuration = targetStopDura
        explodeParticle.start();
    }
    initializeMesh(toClone, posY, meshName, cb){
        this.toDropMesh = toClone.clone(meshName)
        
        this.toDropMesh.parent = this.myChar.bx;
        this.toDropMesh.rotationQuaternion = null;
        this.toDropMesh.position = new Vector3(0,posY,1);
        this.toDropMesh.visibility = .4
        this.toDropMesh.actionManager = new ActionManager(this._scene)

        this.AllFlowerz.forEach(flwrz => {
            this.toRegAction(this.toDropMesh, flwrz.body, e => {
                this.canDropHere = false
                log("cannot drop here")
                this.toDropMesh.isVisible = false
            })
            this.toRegActionExit(this.toDropMesh, flwrz.body, e => {
                this.canDropHere = true
                this.toDropMesh.isVisible = true
            })
        })
    }
    initiateSkill(skillName, player, physicalDmg, plMagicDmg, kolor, forwardDir, skillDmg, prevMode, demonDet){

        const skillRecord = skills.find(skl => skl.name === skillName)
        if(!skillRecord) return log("the skill is not found")
        if(isLoading) return log("other player cast skill, my pc is still loading ...")
        const particleMesh = MeshBuilder.CreateGround("particleMesh", {width: 1, height: 1}, this._scene)
        particleMesh.isVisible = false
        
        const pFos = player.bx.position
        const magicDmgTotal = plMagicDmg + skillDmg
        const corePlusMagDmg = physicalDmg + skillDmg

        const collisionForEnemy = MeshBuilder.CreateGround(skillName, {size: .5}, this._scene)
        collisionForEnemy.isVisible = false

        let fireExplosionJson
        let fireExplode

        let fireClone
        let smokeClone
        switch(skillName){
            case "superPunch":
                // wag idispose etong sound kase sa setAttachSound hinahanap niya yan
                const superPunchedS = this.setAttachSound(skillName, `${skillName}.${player._id}`, player.bx, false)
    
                collisionForEnemy.actionManager = new ActionManager(this._scene)
                collisionForEnemy.position.y += 1
                collisionForEnemy.parent = player.rHand
                const theParticle = this.createParticle("flare", 30, false, .05, {min: 1, max: 2}, .1,.5, 0, "cone", false, collisionForEnemy, kolor)
                theParticle.disposeOnStop = true
                theParticle.start()
                theParticle.targetStopDuration = 1   
                Monsterz.forEach(mons => {
                    this.toRegAction(collisionForEnemy, mons.body, () => {
                        log(`I hit ${mons.monsName}`)
                        const monsFos = mons.body.position
                        superPunchedS.play()
                        this.logicWhenMonsterIsHit(player, mons, monsFos, pFos, physicalDmg, skillDmg);

                        this.createBloodParticle("blood", 50, monsFos, "sphere", true, 1, true, false);
                        const colFos = collisionForEnemy.getAbsolutePosition()

                        particleMesh.position = new Vector3(colFos.x,colFos.y,colFos.z)
                        particleMesh.lookAt(new Vector3(monsFos.x, colFos.y,monsFos.z),0,0,0, BABYLON.Space.WORLD)
                        const burstEffect = this.createParticle("flare", 300,{ x: 0, y: 0,z: 0}, .06, {min: .3, max: .5}, .1,.3, 0, "cone", true, particleMesh, kolor, {x: .4,y:1})
                        particleMesh.addRotation(Math.PI/2,0,0)
                        burstEffect.disposeOnStop = true
                        burstEffect.targetStopDuration = 2
                        this.disposeMeeleeMesh(collisionForEnemy)
                        this.addToBash({_id: mons.monsId, mesh: mons.body, bashPower: this.bigBash})
                    })
                })
                demons.forEach(mons => {
                    this.toRegAction(collisionForEnemy, mons.bx, () => {
                        const theDemon = demons.find(dm => dm._id === mons._id)
                        if(!theDemon) return
                        if(theDemon.hp <= 0) return log("demon have 0hp")

                        const monsFos = theDemon.bx.position
                        superPunchedS.play()
                        this.demonIsHit(mons._id, pFos, physicalDmg + skillDmg, monsFos, player.mode, true)
                        this.createBloodParticle("blood", 50, monsFos, "sphere", true, 1, true, false);
                        const colFos = collisionForEnemy.getAbsolutePosition()

                        particleMesh.position = new Vector3(colFos.x,colFos.y,colFos.z)
                        particleMesh.lookAt(new Vector3(monsFos.x, colFos.y,monsFos.z),0,0,0, BABYLON.Space.WORLD)
                        const burstEffect = this.createParticle("flare", 300,{ x: 0, y: 0,z: 0}, .06, {min: .3, max: .5}, .1,.3, 0, "cone", true, particleMesh, kolor, {x: .4,y:1})
                        particleMesh.addRotation(Math.PI/2,0,0)
                        burstEffect.disposeOnStop = true
                        burstEffect.targetStopDuration = 2
                        burstEffect.start()
                        this.disposeMeeleeMesh(collisionForEnemy)
                        this.addToBash({_id: mons._id, mesh: mons.bx, bashPower: this.bigBash})
                    })
                })
                setTimeout(() => {
                    this.disposeMeeleeMesh(collisionForEnemy)
                }, skillRecord.returnModeDura)
            break
            case "leap":
                smoke.targetStopDuration = 1.5
                smoke.emitter = player.bx
                smoke.start()
                this.animStopAll(player, ["walk", "running", "attack"], true)
                this.playAnim(player.anims, skillRecord.name)

                this.flyingWeaponz.push({meshId: player._id, mesh: player.bx, spd: skillDmg})
                setTimeout(() => {
                    this.flyingWeaponz = this.flyingWeaponz.filter(mesz => mesz.meshId !== player._id)
                }, 400) // 500 is fix the spd is not fixed
            break
            case "backdash":
                smoke.targetStopDuration = 1.5
                smoke.emitter = player.bx
                smoke.start()
                this.animStopAll(player, ["walk", "running", "attack"], true)
                this.playAnim(player.anims, skillRecord.name)
                this.flyingWeaponz.push({meshId: player._id, mesh: player.bx, spd: -skillDmg})
                player._casting = true
                setTimeout(() => {
                    
                    this.flyingWeaponz = this.flyingWeaponz.filter(mesz => mesz.meshId !== player._id)
                }, 400) // 500 is fix the spd is not fixed
            break;
            case "fireBall":
                this.setAttachSound(skillName, `fireBall.${player._id}`, player.bx, true)
                
                // particles for explosion
                fireExplosionJson = {"name":"Explode Particle","id":"default system","capacity":10000,"disposeOnStop":false,"manualEmitCount":-1,"emitter":[0,0,0],"particleEmitterType":{"type":"SphereParticleEmitter","radius":1,"radiusRange":1,"directionRandomizer":0},"texture":{"tags":null,"url":"https://www.babylonjs.com/assets/Flare.png","uOffset":0,"vOffset":0,"uScale":1,"vScale":1,"uAng":0,"vAng":0,"wAng":0,"uRotationCenter":0.5,"vRotationCenter":0.5,"wRotationCenter":0.5,"homogeneousRotationInUVTransform":false,"isBlocking":true,"name":"https://www.babylonjs.com/assets/Flare.png","hasAlpha":false,"getAlphaFromRGB":false,"level":1,"coordinatesIndex":0,"coordinatesMode":0,"wrapU":1,"wrapV":1,"wrapR":1,"anisotropicFilteringLevel":4,"isCube":false,"is3D":false,"is2DArray":false,"gammaSpace":true,"invertZ":false,"lodLevelInAlpha":false,"lodGenerationOffset":0,"lodGenerationScale":0,"linearSpecularLOD":false,"isRenderTarget":false,"animations":[],"invertY":true,"samplingMode":3,"_useSRGBBuffer":false},"isLocal":false,"animations":[],"beginAnimationOnStart":false,"beginAnimationFrom":0,"beginAnimationTo":60,"beginAnimationLoop":false,"startDelay":0,"renderingGroupId":0,"isBillboardBased":true,"billboardMode":7,"minAngularSpeed":0,"maxAngularSpeed":0,"minSize":0.1,"maxSize":0.1,"minScaleX":1,"maxScaleX":1,"minScaleY":1,"maxScaleY":1,"minEmitPower":3,"maxEmitPower":3,"minLifeTime":2.9,"maxLifeTime":3,"emitRate":800,"gravity":[0,0,0],"noiseStrength":[10,10,10],"color1":[0.10588235294117647,0,0,1],"color2":[0.1803921568627451,0.01568627450980392,0,1],"colorDead":[0.1568627450980392,0,0,1],"updateSpeed":0.083,"targetStopDuration":0,"blendMode":0,"preWarmCycles":0,"preWarmStepOffset":1,"minInitialRotation":0,"maxInitialRotation":0,"startSpriteCellID":0,"spriteCellLoop":true,"endSpriteCellID":0,"spriteCellChangeSpeed":1,"spriteCellWidth":0,"spriteCellHeight":0,"spriteRandomStartCell":false,"isAnimationSheetEnabled":false,"sizeGradients":[{"gradient":0,"factor1":1.4,"factor2":2},{"gradient":1,"factor1":0.01,"factor2":0.25}],"textureMask":[1,1,1,1],"customShader":null,"preventAutoStart":false}
                fireExplode = new BABYLON.ParticleSystem.Parse(fireExplosionJson, this._scene, "")
                fireExplode.stop()
                
                collisionForEnemy.actionManager = new ActionManager(this._scene)
                collisionForEnemy.position = new Vector3(pFos.x, this.yPos, pFos.z)
                fireClone = fire.clone("fireclone")
                smokeClone = smoke.clone("smokeClone")
                collisionForEnemy.lookAt(new Vector3(forwardDir.x, this.yPos, forwardDir.z),0,0,0)
            
                Monsterz.forEach(mons => {
                    this.toRegAction(collisionForEnemy, mons.body, () => {
                        const fireExplodeS = this._allSounds.hitByFireS.clone('explode')
                        log(`fireball hit ${mons.monsName}`);

                        // sound
                        fireExplodeS.attachToMesh(mons.body)
                        fireExplodeS.play()
                        this.disposeSounds([fireExplodeS], 4000)
                        // particle
                        fireExplode.emitter = mons.body                            
                        fireExplode.disposeOnStop = true
                        fireExplode.targetStopDuration = 1
                        fireExplode.start();

                        const monsFos = mons.body.position
                        this.logicWhenMonsterIsHit(player, mons, monsFos, pFos, plMagicDmg, skillDmg)

                        particleMesh.parent = null
                        const newColPos = collisionForEnemy.getAbsolutePosition()
                        particleMesh.position = new Vector3(newColPos.x,newColPos.y,newColPos.z)
                        fireClone.disposeOnStop = true
                        fireClone.targetStopDuration = 1
                        smokeClone.disposeOnStop = true
                        smokeClone.targetStopDuration = 1
                        this.createBloodParticle("blood", 50, monsFos, "sphere", true, 1, true, false);
                        this.disposeMeeleeMesh(collisionForEnemy)
                    
                        this.chaseSomeone(player, mons)
                    })
                })
                demons.forEach(mons => {
                    this.toRegAction(collisionForEnemy, mons.bx, () => {
                        const theDemon = demons.find(dm => dm._id === mons._id)
                        if(!theDemon) return log('demon not found')
                        if(theDemon.hp <= 0) return log("demon have 0hp")
                        const fireExplodeS = this._allSounds.hitByFireS.clone('explode')
                        
                        // sound
                        fireExplodeS.attachToMesh(theDemon.bx)
                        fireExplodeS.play()
                        this.disposeSounds([fireExplodeS], 4000)
                        // particle
                        fireExplode.emitter = theDemon.bx                            
                        fireExplode.disposeOnStop = true
                        fireExplode.targetStopDuration = 1
                        fireExplode.start();

                        const monsFos = mons.bx.position
                        this.demonIsHit(mons._id, pFos, magicDmgTotal, monsFos, player.mode, true)

                        particleMesh.parent = null
                        const newColPos = collisionForEnemy.getAbsolutePosition()
                        particleMesh.position = new Vector3(newColPos.x,newColPos.y,newColPos.z)
                        fireClone.disposeOnStop = true
                        fireClone.targetStopDuration = 1
                        smokeClone.disposeOnStop = true
                        smokeClone.targetStopDuration = 1
                        this.createBloodParticle("blood", 50, monsFos, "sphere", true, 1, true, false);
                        this.disposeMeeleeMesh(collisionForEnemy)
                        
                        this.playerLookAt(theDemon.bx, this.myChar.bx.position)
                        if(!theDemon._attacking){
                            theDemon.mode = "weapon"
                            theDemon._moving = true
                            theDemon.targHero = this.det._id
                        } 
                    })
                })                
                collisionForEnemy.locallyTranslate(new Vector3(0,0,1))

                fireClone.emitter = particleMesh
                smokeClone.emitter = particleMesh
                particleMesh.parent = collisionForEnemy
                particleMesh.addRotation(-Math.PI/2,0,0)
                this.flyingWeaponz.push({meshId: makeRandNum(), mesh: collisionForEnemy})
            break
            case "rephantasm":
                this._allSounds.rephantasmS.attachToMesh(player.bx)
                this._allSounds.rephantasmS.play()
                allsword[0].isVertical = true
                const rephantasmClone = allsword[0].clone("rephantasm")
                rephantasmClone.position = new Vector3(0,0,0)
                if(!demonDet){
                    const rephMat = new StandardMaterial("rephMat")
                    rephMat.emissiveColor = new Color3(0.76, 0.77, 0)
                    rephantasmClone.material = rephMat
                }
                const {weapMesh,weapId, clonedWeapon} = this.createFlyingWeapon(pFos, magicDmgTotal, "throw", rephantasmClone, this.getMyPos(player.bx, .5), this.getMyPos(player.bx, 2), false, player._id, demonDet)
                if(demonDet){
                    weapMesh.actionManager = new ActionManager(this._scene)
                    this.toRegAction(weapMesh, this.myChar.rootMesh, () => {
                        const isStillFlying = this.flyingWeaponz.find(flywep =>flywep.meshId === weapId)
                        if(!isStillFlying) return log("the spear is already stabbed");

                        this.flyingWeaponz = this.flyingWeaponz.filter(weaps => weaps.meshId !== weapId);
                        clonedWeapon.scaling = new Vector3(1,1,1)
                        weapMesh.parent = this.myChar.rootMesh
                        weapMesh.position = new Vector3(0,Math.random()*1.7,0)
                        
                        this.myChar.bloodSplat.start()
                        this.myChar.spearStruck.play()
                        const chrPos = player.bx.getAbsolutePosition()
                        weapMesh.lookAt(new Vector3(chrPos.x,this.yPos, chrPos.z),0,0,0, BABYLON.Space.WORLD)
                        weapMesh.addRotation(Math.PI-.6,0,0)
                        weapMesh.locallyTranslate(new Vector3(0,0,-4.5+Math.random()*1))
                        this.hitByNonMultiAI(this.myChar.bx, player.bx, skillDmg, "hit", demonDet._id, false, demonDet, true);
                        this.playAnim(this.myChar.anims, "hit")
                        this.disposeActionM(weapMesh)
                    })
                }
                this.disposeMeeleeMesh(rephantasmClone)
            break
            case "spinningStar":
                this.setAttachSound(skillName, `spinningStar.${player._id}`, player.bx, true)
                const fireExplodeS = this._allSounds.hitByFireS.clone('explode')
                // particles for explosion
                fireExplosionJson = {"name":"Explode Particle","id":"default system","capacity":10000,"disposeOnStop":false,"manualEmitCount":-1,"emitter":[0,0,0],"particleEmitterType":{"type":"SphereParticleEmitter","radius":1,"radiusRange":1,"directionRandomizer":0},"texture":{"tags":null,"url":"https://www.babylonjs.com/assets/Flare.png","uOffset":0,"vOffset":0,"uScale":1,"vScale":1,"uAng":0,"vAng":0,"wAng":0,"uRotationCenter":0.5,"vRotationCenter":0.5,"wRotationCenter":0.5,"homogeneousRotationInUVTransform":false,"isBlocking":true,"name":"https://www.babylonjs.com/assets/Flare.png","hasAlpha":false,"getAlphaFromRGB":false,"level":1,"coordinatesIndex":0,"coordinatesMode":0,"wrapU":1,"wrapV":1,"wrapR":1,"anisotropicFilteringLevel":4,"isCube":false,"is3D":false,"is2DArray":false,"gammaSpace":true,"invertZ":false,"lodLevelInAlpha":false,"lodGenerationOffset":0,"lodGenerationScale":0,"linearSpecularLOD":false,"isRenderTarget":false,"animations":[],"invertY":true,"samplingMode":3,"_useSRGBBuffer":false},"isLocal":false,"animations":[],"beginAnimationOnStart":false,"beginAnimationFrom":0,"beginAnimationTo":60,"beginAnimationLoop":false,"startDelay":0,"renderingGroupId":0,"isBillboardBased":true,"billboardMode":7,"minAngularSpeed":0,"maxAngularSpeed":0,"minSize":0.1,"maxSize":0.1,"minScaleX":1,"maxScaleX":1,"minScaleY":1,"maxScaleY":1,"minEmitPower":3,"maxEmitPower":3,"minLifeTime":2.9,"maxLifeTime":3,"emitRate":800,"gravity":[0,0,0],"noiseStrength":[10,10,10],"color1":[0.10588235294117647,0,0,1],"color2":[0.1803921568627451,0.01568627450980392,0,1],"colorDead":[0.1568627450980392,0,0,1],"updateSpeed":0.083,"targetStopDuration":0,"blendMode":0,"preWarmCycles":0,"preWarmStepOffset":1,"minInitialRotation":0,"maxInitialRotation":0,"startSpriteCellID":0,"spriteCellLoop":true,"endSpriteCellID":0,"spriteCellChangeSpeed":1,"spriteCellWidth":0,"spriteCellHeight":0,"spriteRandomStartCell":false,"isAnimationSheetEnabled":false,"sizeGradients":[{"gradient":0,"factor1":1.4,"factor2":2},{"gradient":1,"factor1":0.01,"factor2":0.25}],"textureMask":[1,1,1,1],"customShader":null,"preventAutoStart":false}
                fireExplode = new BABYLON.ParticleSystem.Parse(fireExplosionJson, this._scene, "")
                fireExplode.stop()
                
                collisionForEnemy.actionManager = new ActionManager(this._scene)
                fireClone = fire.clone("fireclone")
                smokeClone = smoke.clone("smokeClone")
                
                const spinningBx = collisionForEnemy.createInstance("spinningBx")
                spinningBx.parent = player.bx;
                spinningBx.position = new Vector3(0,0,0)
                spinningBx.isVisible = false
                collisionForEnemy.parent = spinningBx
                collisionForEnemy.position = new Vector3(0,0,0)
                collisionForEnemy.locallyTranslate(new Vector3(0,0,-1.6))

                this.allRotating = this.allRotating.filter(megs => megs.meshId !== player._id)
                this.allRotating.push({meshId: player._id, mesh: spinningBx, isForward: false, spd: .1})

                if(!demonDet){
                    Monsterz.forEach(mons => {
                        this.toRegAction(collisionForEnemy, mons.body, () => {
                            const fireExplodeS = this._allSounds.hitByFireS.clone('explode')
                            log(`fireball hit ${mons.monsName}`);

                            this.makeExplosive(fireExplodeS, fireExplode, mons.body, 3000, true, 1)
    
                            const monsFos = mons.body.position
                            this.logicWhenMonsterIsHit(player, mons, monsFos, pFos, plMagicDmg, skillDmg)
    
                            particleMesh.parent = null
                            const newColPos = collisionForEnemy.getAbsolutePosition()
                            particleMesh.position = new Vector3(newColPos.x,newColPos.y,newColPos.z)
                            fireClone.disposeOnStop = true
                            fireClone.targetStopDuration = 1
                            smokeClone.disposeOnStop = true
                            smokeClone.targetStopDuration = 1
                            this.createBloodParticle("blood", 50, monsFos, "sphere", true, 1, true, false);
                            this.disposeMeeleeMesh(collisionForEnemy)
                        
                            this.chaseSomeone(player, mons)
                        })
                    })
                    demons.forEach(mons => {
                        this.toRegAction(collisionForEnemy, mons.bx, () => {
                            const theDemon = demons.find(dm => dm._id === mons._id)
                            if(!theDemon) return log('demon not found')
                            if(theDemon.hp <= 0) return log("demon have 0hp")
                            const fireExplodeS = this._allSounds.hitByFireS.clone('explode')
                            
                            // sound
                            fireExplodeS.attachToMesh(theDemon.bx)
                            fireExplodeS.play()
                            this.disposeSounds([fireExplodeS], 4000)
                            // particle
                            fireExplode.emitter = theDemon.bx                            
                            fireExplode.disposeOnStop = true
                            fireExplode.targetStopDuration = 1
                            fireExplode.start();
    
                            const monsFos = mons.bx.position
                            this.demonIsHit(mons._id, pFos,skillDmg, monsFos, player.mode, true)
    
                            particleMesh.parent = null
                            const newColPos = collisionForEnemy.getAbsolutePosition()
                            particleMesh.position = new Vector3(newColPos.x,newColPos.y,newColPos.z)
                            fireClone.disposeOnStop = true
                            fireClone.targetStopDuration = 1
                            smokeClone.disposeOnStop = true
                            smokeClone.targetStopDuration = 1
                            this.createBloodParticle("blood", 50, monsFos, "sphere", true, 1, true, false);
                            this.disposeMeeleeMesh(collisionForEnemy)
                            
                            this.playerLookAt(theDemon.bx, this.myChar.bx.position)
                            if(!theDemon._attacking){
                                theDemon.mode = "weapon"
                                theDemon._moving = true
                                theDemon.targHero = this.det._id
                            } 
                        })
                    })
                }
                fireClone.emitter = particleMesh
                smokeClone.emitter = particleMesh
                particleMesh.parent = collisionForEnemy
                if(demonDet){
                    setTimeout(() => {
                        this.toRegAction(collisionForEnemy, this.myChar.bx, () => {
                            log(demonDet.dmg)
                            this.hitByNonMultiAI(this.myChar.bx, player.bx, skillDmg, "hit", demonDet._id, false);
                            this.makeExplosive(fireExplodeS, fireExplode, this.myChar.bx, 3000, true, 1)
                            
                            particleMesh.parent = this.myChar.bx
                            fireClone.disposeOnStop = true
                            fireClone.targetStopDuration = 1
                            smokeClone.disposeOnStop = true
                            smokeClone.targetStopDuration = 1
                            this.disposeMeshes([particleMesh, collisionForEnemy], 1200)
                        })
                    }, 500)
                }
            break;
        }
        setTimeout(() => {
            particleMesh.dispose()
            if(collisionForEnemy){
                this.disposeMeeleeMesh(collisionForEnemy)
                this.disposeActionM(collisionForEnemy)
            }
        }, 10000)
        setTimeout(() => {
            if(demonDet) return
            player._casting = false
            if(skillRecord.requireMode === "any"){
                player.mode = player.prevMode
            }else{
                player.mode = skillRecord.requireMode
            }
        }, skillRecord.returnModeDura)

        if(demonDet) return collisionForEnemy
    }
    initSlashEffect(mesh, pos, targ, meshId, spd, rotatZ, removTimeOut){
        if(!slash) return
        mesh.position = new Vector3(pos.x, pos.y, pos.z)
        this.playerLookAt(mesh, targ);
        mesh.locallyTranslate(new Vector3(0,0,.4))
        mesh.visibility = 1
        mesh.rotationQuaternion = null
        mesh.addRotation(0,0,rotatZ)
        this.flyingWeaponz = this.flyingWeaponz.filter(weap => weap.meshId !== meshId)
        this.flyingWeaponz.push({meshId, mesh, spd})
        this.allVanishing = this.allVanishing.filter(circs => circs.mesh.name !== mesh.name)
        this.allVanishing.push({mesh, spd: .05})
        // setTimeout(() => {
        //     this.flyingWeaponz = this.flyingWeaponz.filter(weap => weap.meshId !== meshId)
        //     mesh.rotationQuaternion = null
        //     // setTimeout(() => {
        //     //     this.allVanishing = this.allVanishing.filter(circs => circs.mesh.name !== mesh.name)
        //     // }, 600)          
        // }, removTimeOut)
    }
    initMonsterThrow(monsId, player, dmg, effects){
        const theMonster = Monsterz.find(mon => mon.monsId === monsId)
        if(!theMonster) return log("monster no longer here")
        
        let objectToThrow
        let objectMat
        let animName
        let impactSound
        let effect
        let willStick = false
        
        switch(theMonster.monsName){
            case "monoloth":
                willStick = true
                const sting = this.likeSting.clone("beeSting")
                impactSound = this._allSounds.spearStruckS.clone("beeStruck")
                
                objectToThrow = MeshBuilder.CreateGround("theSting", {width: .3, height: .5}, this._scene)
                sting.parent = objectToThrow
                sting.addRotation(Math.PI/2,0,0)
                objectToThrow.isVisible = false;
                animName = "attack1"
                impactSound.attachToMesh(objectToThrow)
            break;
            case "golem":
                effect = "fall"
                
                objectToThrow = this.likeRock.clone("golemRock")
                impactSound = this._allSounds.superPunched.clone("golemRock")
                impactSound.attachToMesh(objectToThrow)
                setTimeout(() => {
                    this.disposeMeeleeMesh(objectToThrow)
                    this.disposeSounds([impactSound])
                }, 5000)
                animName = "throw"
            break;
        }
        const mPos = theMonster.body.position
        const pFos = player.bx.position
        this.playAnim(theMonster.anims, animName)
        objectToThrow.actionManager = new ActionManager(this._scene)
        players.forEach(pl => {
            this.toRegAction(objectToThrow, pl.bx, () => {
                if(pl._id === this.det._id){
                    this.stopPress();
                    this.disableMoving()
                    this.stopMoving()
                    const prevMode = this.myChar.mode
                    this.myChar.mode = "none"
                    setTimeout(() => {
                        this.allCanPress()
                        this.myChar.mode = prevMode
                    }, 400)
                    if(effect){
                        switch(effect){
                            case "fall":
                                this.socketAvailable && this.socket.emit('userBump', {_id: pl._id, pos:{ x: pl.bx.position.x, z: pl.bx.position.z }, 
                                dirTarg: {x: theMonster.body.position.x, z: theMonster.body.position.z} })
                                if(!this.socketAvailable) this.bump(pl)
                            break
                        }
                    }
                    this.hitByNonMultiAI(pl.bx, theMonster.body, dmg, "hit", monsId)
                    this.socketAvailable && this.socket.emit("playerIsHit", {_id: pl._id, monsId, animName: 'hit', dmg})
                }

                this.createBloodParticle("blood", 20, mPos, "sphere", true, 1, true, pl.bx)
                if(impactSound) impactSound.play()
            })
        })
        

        objectToThrow.position = new Vector3(mPos.x, this.yPos+.4, mPos.z)
        objectToThrow.lookAt(new Vector3(pFos.x, objectToThrow.position.y, pFos.z),0,0,0, BABYLON.Space.WORLD)
        objectToThrow.locallyTranslate(new Vector3(0,0,.6));
        this.flyingWeaponz.push({mesh: objectToThrow, spd: 15})
    }
    async deductItemForCrafting(theRequirements){
        theRequirements.forEach(rqmnt => {
            const theItemReq = this.det.items.find(itm=>itm.name === rqmnt.name)
            if(theItemReq){
                theItemReq.qnty -= rqmnt.qnty;
                if(theItemReq.qnty < 1){
                    this.det.items = this.det.items.filter(itm => itm.meshId !== theItemReq.meshId)
                }
            }
        })
        await this.updateMyDetailsOL(this.det, false);
    }
    chaseSomeone(player, mons){
        if(this.socketAvailable){
            if(player._id === this.det._id){ // so it will only run once
                log("is online will chase")
                this.socket.emit("monsWillChase", {monsId: mons.monsId, targHero: this.det._id})
            }
        }else{
            if(player._id === this.det._id){
                mons.isAttacking = false
                mons.targHero = this.det._id
                mons.isChasing = true
            }
        }
    }
    checkAllMyCrafts(){
        craftCont.style.display = "flex"
        const toCraftList = document.querySelector(".to-crafts")
        toCraftList.innerHTML = ''
        if(!this.det.mycrafts.length) return
        const notAllowed = this.notAllowedCraft.some(pName => pName === this.currentPlace)
        if(notAllowed) return this.showTransaction("Craft Not Allowed", 2000)
        this.det.mycrafts.forEach(crft => {
            const crftBx = createElement("div", "crft-bx")
            const crftImg = createElement("img", "craft-img")
            crftImg.src = `./images/actions/${crft.name}.svg`
            crftBx.append(crftImg);

            const crftDefBx = createElement("div", "crft-bx-def")
            const crftName = createElement("p", "crft-name", crft.name);
            const crftCap = createElement("p", "crft-reqcap", 'requirements');
            crftDefBx.append(crftName)
            crftDefBx.append(crftCap)
            crftBx.append(crftDefBx)
            const rgmntBx = createElement("div", "rqmnts-bx")
            crft.requirements.forEach(rqmnt => {
                
                const rqmntImg = createElement("img", "rqmnt-img")
                rqmntImg.src = `./images/loots/${rqmnt.name}.png`

                const crftQntyCap = createElement("p", "crft-qnty", `x${rqmnt.qnty}`);
                rgmntBx.append(rqmntImg);
                rgmntBx.append(crftQntyCap);
            })
            crftDefBx.append(rgmntBx)
            toCraftList.append(crftBx)
            crftBx.addEventListener("click", e => {
                if(this.toDropMesh || this.craftFunc) return this._statPopUp("cancel crafting", 100, "crimson")
 
                let requirementsPassed = 0
                
                crft.requirements.forEach(rqmnt => {
                    const requiredItem = this.det.items.find(itm => itm.name === rqmnt.name)
                    if(requiredItem){
                        if(requiredItem.qnty >= rqmnt.qnty){
                            log(requiredItem.name + "passed !")
                            requirementsPassed++
                        }
                    }
                })
                if(requirementsPassed < crft.requirements.length) return crftBx.innerHTML = `<p class="insuf">Insufficient Tools</p>`
                toCraftCont.style.display = "flex"
                craftCont.style.display = "none"
                this.myChar._crafting = true
                switch(crft.name){
                    case "bonfire":
                        this.initializeMesh(bonFireMesh, -this.yPos, crft.name);
                        this.craftFunc = () => {
                            if(this.currentPlace.includes("apartment") || this.currentPlace.includes("guild") || this.currentPlace.includes("heartland")) return this.showTransaction("Not Allowed Here", 2400)
                            this.myChar.mode = 'none'
                            toCraftCont.style.display = "none"
                            const bonFPos = this.toDropMesh.getAbsolutePosition();
                            this.willBow()
                            const {x,z} = this.myChar.bx.position
                            const myFPos = this.getMyPos(this.myChar.bx, 2)
                            if(this.socketAvailable) this.socket.emit("stop-dosomething", 
                            {_id: this.det._id, 
                            dirTarg:{x: myFPos.x,z:myFPos.z}, 
                            mypos: {x,z}, dur: 2000,
                            mode: "willbow" })

                            this.myChar.bx.lookAt(new Vector3(myFPos.x,this.yPos,myFPos.z),0,0,0)
                            this.willHeadLoading(400, () => { 
                                openGameUI(this.det)
                                this.myChar.mode = 'stand'
                                this.allCanPress()
                                if(!this.socketAvailable) this.craftBonFire({x: bonFPos.x, y: bonFPos.y, z: bonFPos.z})
                                if(this.socketAvailable) this.socket.emit("plant-bonfire", 
                                {meshId: makeRandNum(), pos: {x: bonFPos.x, y: bonFPos.y, z: bonFPos.z}, place: this.currentPlace });
                                this.cancelCraft()
                                this.deductItemForCrafting(crft.requirements)
                            })
                        }                        
                    break
                    case "bedleave":
                        this.initializeMesh(bedLeaveMesh, -this.yPos, crft.name);
                        this.craftFunc = () => {
                            if(this.currentPlace.includes("apartment") || this.currentPlace.includes("guild") || this.currentPlace.includes("heartland")) return this.showTransaction("Not Allowed Here", 2400)
                            this.myChar.mode = 'none'
                            toCraftCont.style.display = "none"
                            const bonFPos = this.toDropMesh.getAbsolutePosition();
                            this.willBow()
                            const {x,z} = this.myChar.bx.position
                            const myFPos = this.getMyPos(this.myChar.bx, 2)
                            if(this.socketAvailable) this.socket.emit("stop-dosomething", 
                            {_id: this.det._id, 
                            dirTarg:{x: myFPos.x,z:myFPos.z}, 
                            mypos: {x,z}, dur: 2000,
                            mode: "willbow" })

                            this.myChar.bx.lookAt(new Vector3(myFPos.x,this.yPos,myFPos.z),0,0,0)
                            this.willHeadLoading(400, () => {
                                openGameUI(this.det)
                                this.myChar.mode = 'stand'
                                this.allCanPress()
                                log(bonFPos)
                                this.craftBedLeave({x: bonFPos.x, y: bonFPos.y+.05, z: bonFPos.z}, this._scene)
                                if(this.socketAvailable) this.socket.emit("plant-bedleave", 
                                {meshId: makeRandNum(), pos: {x: bonFPos.x, y: bonFPos.y, z: bonFPos.z}, place: this.currentPlace });
                                this.cancelCraft()
                                this.deductItemForCrafting(crft.requirements)
                            })
                        } 
                    break;
                    default: // crafting weapon
                        this.craftFunc = () => {
                            toCraftCont.style.display = "none"
                            craftCont.style.display = "none"
                            this.stopPress()
                            this.willHeadLoading(400, () => {
                                openGameUI(this.det)
                                this.allCanPress()
                                const theItemToCraft = records.find(itm => itm.name === crft.weaponName)
                                this.claimReward({...theItemToCraft, meshId: makeRandNum(), qnty: 1, price: theItemToCraft.secondPrice}, 400)
                                this.deductItemForCrafting(crft.requirements)
                                this.cancelCraft()
                            })
                        } 
                    break
                }
            })
        })
    }
    showMyAdventurerDetails(){
        advCont.style.display = "flex"
        const rankDet = ranks.find(rn => rn.rankDig === this.det.rank)
        if(!rankDet) return log("not found my rank")
        advDet.children[0].innerHTML = `rank: ${rankDet.displayRank}`
        advDet.children[1].innerHTML = `kills: ${this.det.monsterKilled}`
        advDet.children[2].innerHTML = `cleared: ${this.det.clearedQuests.totalCleared}`
        advQuestLists.innerHTML = ''
        this.checkItemsForQuest("edibles")
        this.det.quests.forEach(myqst => {
            log(myqst)
            const newDiv = createElement("div", "myquest-bx")
            // const divBackImg = createElement("img", "myquest-backimg")
            // divBackImg.src="./images/setup/scroll.png"
            // newDiv.append(divBackImg)
            const newImg = createElement("img", "myquest-img")
            if(myqst.questPicName !== ""){
                newImg.src = `./images/questpics/${myqst.questPicName}.png`
            }else{
                newImg.src = `./images/loots/${myqst.questTarget.targetName}.png`
            }
            const qstTtle = createElement("p", "myquest-ttle", myqst.title)

            const qstDemNumber = createElement("p", "myquest-demand", `required: ` +myqst.demandNumber)
            newDiv.append(newImg)
            newDiv.append(qstTtle)

            newDiv.append(qstDemNumber)

            advQuestLists.append(newDiv)
            
            newDiv.addEventListener("click", () => {
                rewardInfo = myqst
                this.showQuestInfo(true)
                log(myqst)
            })
        })
    }
    showSkillList(skillz, isMine){
        myskillLists.innerHTML = ''
        let canShow = true
        let totalOfList = 0
        skillz.forEach(skl => {
            if(!isMine){
                if(skl.pointsToClaim > this.det.points) canShow = false
                const alreadyLearned = this.det.skills.some(myskl => myskl.name === skl.name)
                if(alreadyLearned) return
            }
            const bx = createElement("li", `skill-bx ${skl.name}`)
            const sbLeft = createElement("div", "sb-left")

            const sbImgE = createElement("img", "skill-img");
            sbImgE.src = `./images/skills/${ !canShow ? 'lock' : skl.name}.png`
            const skillNE = createElement("p", "sb-skillName", skl.displayName);
            const skillLvlE = createElement("p", "sb-skillLvl", `Lvl. ${skl.lvl}`);
            const skillTierE = createElement("p", "sb-tier", `${skl.tier}`);
            const skillUpBtn = createElement("button", isMine ? "sb-skillup" : "sb-nbtn", `${isMine ? "+" : "Learn"}`);
            
            switch(skl.tier){
                case "common":
                    skillTierE.style.color = "#3b3206" // brownish
                break
                case "rare":
                    skillTierE.style.color = "#053693"
                break;
            }
            if(!canShow) skillTierE.style.color = "#f5f5f5"
            sbLeft.append(sbImgE)
            if(canShow){
                sbLeft.append(skillNE)
                isMine && sbLeft.append(skillLvlE)
            }
            if(!canShow){
                bx.style.background = "url('../images/skills/lockbg.jpg')"
                bx.style.opacity = .8
            }
            bx.append(sbLeft);
            bx.append(skillTierE)
            canShow && bx.append(skillUpBtn)
            myskillLists.append(bx)

            skillUpBtn.addEventListener("click", async () => {
                if(isMine){
                    if(this.det.points < skl.pointsForUpgrade) return this.showTransaction(`Required Points x${skl.pointsForUpgrade}`, 2500)
                    this.det.skills.forEach(myskl => {
                        if(myskl.name === skl.name){
                            myskl.lvl += 1;
                            myskl.effects.plusDmg += myskl.upgradePlus
                        }                        
                    })
                    this._allSounds.upgradeS.play()
                }else{
                    if(this.det.points < skl.pointsToClaim) return this.showTransaction(`Required Points x${skl.pointsToClaim}`, 2500)
                    const haveAlready = this.det.skills.some(myskl => myskl.name === skl.name)
                    if(haveAlready) return this.showTransaction('skill already have', 2500)

                    this.det.skills.push(skl)
                    this._allSounds.skillAcquiredS.play()
                }
                this.blurButtons([AllSkillInfoCont])

                this.det.points -= isMine ? skl.pointsForUpgrade : skl.pointsToClaim
                await this.updateMyDetailsOL(this.det, true)
                this.setHTMLUI(this.det)
                this.returnButtons([AllSkillInfoCont])
                if(!isMine){
                    this.showTransaction("Skill Learned", 2500)
                    this.setMySkills()
                    this.checkSkillModes()
                }                
                this.showSkillList(isMine ? this.det.skills : skills, isMine)
            })
            totalOfList++
        })
        if(!totalOfList){
            const noListCap = createElement("p", "no-skills", "No Skills To Show")
            myskillLists.append(noListCap)
        }
    }
    showAllSkillz(){
        AllSkillInfoCont.style.display = "block"
        AllSkillInfoCont.classList.remove("transClose")
        // this.showSkillList(skills, false)
        this.showSkillList(this.det.skills, true)
    }
    setRunningSound(){
        myCharDet.runningS.setPlaybackRate(1.2)
        const isOnFloorPlace = this.floorPlaces.some(placeName => this.currentPlace.includes(placeName))
        if(isOnFloorPlace){
            log("is in floor places")
            myCharDet.runningS.setPlaybackRate(1)
        }
    }
    setWalkSound(){
        myCharDet.runningS.setPlaybackRate(.9)
        const isOnFloorPlace = this.floorPlaces.some(placeName => this.currentPlace.includes(placeName))
        if(isOnFloorPlace){
            log("is in floor places")
            myCharDet.runningS.setPlaybackRate(.74)
        }
    }
    setCoolDownSkillUI(skillRec){
        skillCont.childNodes.forEach(chld => {
            if(!chld.className) return
            if(chld.className.split(" ")[1] === skillRec.name){
                this.blurButtons([chld])

                setTimeout(() => {
                    this.returnButtons([chld])
                }, skillRec.skillCoolDown)
            }
        })        
    }
    skillIntro(skillRecord, player){
        player.mode = "none";
        player._casting = true;
        this.playAnim(player.anims, skillRecord.name, skillRecord.animationLoop)
        setTimeout(() => {
            player.mode = skillRecord.requireMode;
            player._casting = false;
            if(skillRecord.requireMode === "any") player.mode = player.prevMode
        }, skillRecord.returnModeDura)
        let leapSound
        switch (skillRecord.name) {
            case "leap":
                leapSound = this._scene.getSoundByName(`leap.${player._id}`)
                if(!leapSound){
                    leapSound = this._allSounds.leapS.clone(`leap.${player._id}`)
                    leapSound.attachToMesh(player.bx)
                    leapSound.setPlaybackRate(1.4)
                }
                
                leapSound.play(0,.2)
            break;
            case "backdash":
                leapSound = this._scene.getSoundByName(`leap.${player._id}`)
                if(!leapSound){
                    leapSound = this._allSounds.leapS.clone(`leap.${player._id}`)
                    leapSound.attachToMesh(player.bx)
                    leapSound.setPlaybackRate(1.4)
                }                
                leapSound.play(0,.2)
            break;
            case "rephantasm":
                const circPos = this.getMyPos(player.bx, .8)
                const infrontP = this.getMyPos(player.bx, 1)
                this.createNewCircle({ r:0.76, g:0.77, b:0}, {x: 3.14159/2, y: 0,z:0}, {x: circPos.x, y: 1.4, z: circPos.z}, player._id, 600, infrontP)
            break;
        }
    }
    setRightUIs(categArrays, allOpen){
        rightUpperUI.style.display = "flex"
        rightUpperUI.childNodes.forEach(nod => {
            if(nod.className){
                nod.style.display = "none"
                categArrays.forEach(categ => {
                    if(nod.className.includes(categ)){
                        nod.style.display = "block"
                    }
                })
                if(allOpen)nod.style.display = "block"
            }
        })
    }
    setSettingsUI(categ){
        const settViews = document.querySelectorAll(".set-view");
        const accUsername = document.querySelector(".sett-username");
        accUsername.innerHTML = `username: ${this.userDetails.username}`
        settViews.forEach(elem => {
            elem.style.display ="none"
            if(elem.className.includes(categ)) elem.style.display ="flex"
        })
    }
    setEventListeners(){
        skillCont.addEventListener("click", e => {
            const targ = e.target.className
            if(!targ.includes("skill-bx")) return log("not skill")
            const skillName = targ.split(" ")[1]
            const skillRecord = this.det.skills.find(skl => skl.name === skillName)
            if(!skillRecord) return log("skill not found")
            if(this.det.hp <= 0) return skillCont.style.display = "none"
            let willContinueSkill = false
            const demandCost = skillRecord.demand.minCost
            switch(skillRecord.demand.name){
                case "hp":

                break;
                default:
                    if(this.det.mp >= demandCost){
                        willContinueSkill = true
                        this.det.mp-=demandCost
                    }
                break
            }
            if(!willContinueSkill) return this.showTransaction(`skill demand not reached`,1500);
            
            const prevMode = this.myChar.mode
            this.myChar.prevMode = this.myChar.mode
            
            this.updateHP_UI()
            this.updateMP_UI()
            this.updateSP_UI()
            this.stopPress()
            this.myChar.runningS.stop()
            setTimeout(() => {
                this.allCanPress()
            }, 600)
            const phyDmg = this.recalMeeleDmg()
            const magDmg = this.recalMagicDmg()
            const elemColor = rgbColors.find(det => det.name === this.det.aptitude[0].name)
            
            // normally this is only for long range skills
            const forwardDir = this.getMyPos(this.myChar.bx, 1);
            const inFrontPos = {x:forwardDir.x,y:this.yPos,z:forwardDir.z}
            this.myChar._casting = true

            if(this.socketAvailable){
                this.socket.emit("willcast", {
                    _id: this.myChar._id,
                    skillName,
                    inFrontPos,
                    place: this.currentPlace
                })
            }else{   
                this.skillIntro(skillRecord, this.myChar)
            }
            this._skillReleaseTimeOut = setTimeout(() => {
                if(this.socketAvailable){
                    this.socket.emit("cast-skill", {
                        _id: this.myChar._id,
                        skillName,
                        phyDmg,
                        magDmg,
                        elemColor: elemColor.rgb,
                        inFrontPos,
                        place: this.currentPlace,
                        skillDmg: skillRecord.effects.plusDmg,
                        prevMode
                    })
                }else{
                    this.initiateSkill(skillName, this.myChar, phyDmg, magDmg, elemColor.rgb, inFrontPos, skillRecord.effects.plusDmg, prevMode)
                }
            }, skillRecord.castDuration)

            this.setCoolDownSkillUI(skillRecord)
        })
        skillCateg.addEventListener("click", e => {
            const skillCategName = e.target.className.split(" ")[1]
            if(skillCategName === undefined) return
            skillCategName === "myskillset" ? this.showSkillList(this.det.skills, true) : this.showSkillList(skills, false) 
        })
        toCraftCont.addEventListener("click", e => {
            const theTargBtn = e.target.innerHTML
            if(theTargBtn.includes(" ")) return log('this is not it')
            if(!this.canDropHere || !this.craftFunc) return this._statPopUp('cannot craft here', 100, "crimson");
            if(theTargBtn === "cancel") return this.cancelCraft()
            return this.craftFunc()
        })
        craftWeaponBtn.addEventListener("click", e => {
            if(this.craftFunc === undefined) return log("craft func not set")
            compatibleCont.classList.add("transClosePopUp")
            setTimeout(() => compatibleCont.style.display = "none", 500)
            this.craftFunc()
        })
        rightUIBtns.forEach(btn => {
            btn.addEventListener("click", e => {
                const btnName = e.target.className.split(" ")[1]
                let display
                
                this._allSounds.nextBtnS.play()
                switch(btnName){
                    case "openstatus":
                        this._allSounds.itemEquipedS.play()
                        profile.children[0].style.right = '6%'
                        profile.children[0].style.top = '-20px'
                        if(!profile.style.display) profile.style.display = "none"
                        profile.style.display === "none" ? display = "flex"  : display = "none"
                        profile.style.display = display
                        log('my items', this.det.items)
                        this.setHTMLUI(this.det)
                        this.setInventory('recource')
                        this.setEquipedItems()
                        occupAndTitleCont.style.display = "none"
                        leftbackG.style.display = "none"
                    break
                    case "crafts":
                        this.checkAllMyCrafts();
                    break
                    case "myquests":
                        this.showMyAdventurerDetails()
                    break
                    case "mystats":
                        myStatContainer.classList.remove("my-stat-hidding")
                    break
                    case "myskills":
                        this.showAllSkillz()
                    break;
                    case "settingsIcon":
                        settingsCont.classList.remove("my-stat-hidding")
                        this.setSettingsUI("foraccount")
                    break;
                }
            })
        })
        rightLowerUI.addEventListener("click", e => {
            const btnName = e.target.className
            if(!btnName.includes("mode-btn")) return log("not a mode btn")
            let modeName
            this.setRunningSound()
            clearInterval(this.hitRecourceInterval)
            this.animStopAll(this.myChar, ["minning"])
            log(this.myChar.anims)
            if(btnName.includes("swordpic")){
                if(this.det.weapon.name === "none") return
                this.setRunningSound()
                if(this.myChar.mode === "stand" || this.myChar.mode === "fist"){

                    this.myChar.mode = "none"
                    myCharDet.mode = "none"
                    this.stopAnim(this.myChar.anims, "running", true);
                    this.playAnim(this.myChar.anims, "willfight");
                    this.myChar.drawSwordS.play(.25)
                    this.stopPress()
                    setTimeout(() => this.getSword(this.myChar.rootSword, this.myChar.rHand), 250)
                    setTimeout(() => {
                        this.myChar.mode = "weapon"
                        myCharDet.mode = "weapon"
                        this.allCanPress()
                        this.changeAtkBtnImg()
                        if(this.socketAvailable){
                            this.socket.emit("changeMode", {
                            _id: this.det._id,
                            mode: modeName
                            })
                        }
                        this.checkSkillModes()
                    } ,510)
                }
                modeName = "weapon"
            }
            if(btnName.includes("handpic")){
                this.keepSword(this.myChar.rootSword, this.myChar.rootBone)
                this.changeAtkBtnImg()
                if(this.myChar.mode === "stand"){
                    this.playAnim(this.myChar.anims, "fromstand")
                    this.setMode("fist", 500)
                }
                if(this.myChar.mode === "weapon"){
                    
                    this.playAnim(this.myChar.anims, "tostand")
                    setTimeout(() => this.playAnim(this.myChar.anims, "fromstand"), 300)
                    this.setMode("fist", 600)
                }
                
            }
            if(btnName.includes("walkpic")){    
                this.setWalkSound()
                this.stopAnim(this.myChar.anims, "fight.idle")
                if(this.myChar.mode === "weapon"){
                    log("yes it is weapon")
                    this.myChar.mode = 'none'
                    myCharDet.mode = 'none'
                    this.playAnim(this.myChar.anims, "tostand")
                    
                    setTimeout(() => {
                        this.myChar.mode = "stand"
                        myCharDet.mode = "stand"
                        this.changeAtkBtnImg()
                        this.keepSword(this.myChar.rootSword, this.myChar.rootBone)
                        if(this.socketAvailable){
                            this.socket.emit("changeMode", {
                            _id: this.det._id,
                            mode: modeName
                            })
                        }
                        this.checkSkillModes()
                    } ,450)
                }
                if(this.myChar.mode === "fist"){
                    this.myChar.mode = "none"
                    this.playAnim(this.myChar.anims, "fromfist")
                    setTimeout(() => {
                        this.myChar.mode = "stand"
                        myCharDet.mode = "stand"
                        this.checkSkillModes()
                    }, 600)
                }
                this.changeAtkBtnImg()
                modeName = "stand"
                if(this.socketAvailable){
                    this.socket.emit("changeMode", {
                    _id: this.det._id,
                    mode: modeName
                    })
                }  
            }
            this.disableRightBtns(1400, false)
        })
        attackBtn.addEventListener("click", e => {
            if(this.det.sp < 1) return this._statPopUp('no stamina', 100, 'yellow')
            if(!this._canpress) return
            if(this.toDropMesh && this.craftFunc) this.cancelCraft()
            let animName
            clearTimeout(this._attackTimeout)
            clearTimeout(this._changeFocusTimeOut)
            this.myChar._attacking = true

            const stopMoving = () => {
                this.myChar.runningS.stop()
                this._canpress = false
                this.disableMoving()
                this.disableAttackBtn()
                this.regEnemyToAttack() // recalculate all monster to be register on my action manager
                this.myChar.weaponCol.position.y = -3.8

                clearTimeout(this._enableKeyPessTimeout)
                this._enableKeyPessTimeout = setTimeout(() => {
                    this.allCanPress()
                    this.enableAttackBtn()
                }, 500)
                this.myChar.mode === "weapon" ? this.det.sp -= 10 : this.det.sp -= 3
                this.updateSP_UI()
                if(this.focusOn !== null) this.myChar.bx.lookAt(new Vector3(this.focusOn.position.x, this.myChar.bx.position.y, this.focusOn.position.z),0,0,0)
            }
            switch(this.myChar.mode){
                case 'fist':
                    if(this._meeleeNum >= 4) this._meeleeNum = 0
                    this._meeleAtk = `meelee${this._meeleeNum}`
                    animName = this._meeleAtk
                    stopMoving();
                    this._meeleeNum++
                break;
                case 'weapon':
                    if(this._atkNum >= 3) this._atkNum = 0
                    this._weaponAtk = `slash.${this._atkNum}`
                    animName = this._weaponAtk
                    stopMoving()
                    this.myChar.whoopS.setPlaybackRate(.8 + Math.random()*.3)
                    this.myChar.whoopS.play(.3)
                    this._atkNum++
                    setTimeout(() => {
                        this.det.race === "elf" && this.initSlashEffect(this.myChar.swordSlash, this.myChar.bx.getAbsolutePosition(),this.getMyPos(this.myChar.bx, .7), this.myChar._id, 10, .5 + Math.random()*.7, 300);
                    },140)      
                break;
                case "stand":
                    this.myChar.mode = "fist"
                break;
            }
            
            this.stopFarming(this.myChar)
            this.stopAnim(this.myChar.anims, animName)
            this.playAnim(this.myChar.anims, animName)
            
            const btfpos = this.btf.position
            this.socketAvailable && this.socket.emit("attack", {_id: this.det._id, animName, mode: this.myChar.mode, dirTarg: {x: this.focusOn !== null ? this.focusOn.position.x : btfpos.x, y: this.myChar.bx.position.y, z: this.focusOn !== null ? this.focusOn.position.z : btfpos.z}})

            this._attackTimeout = setTimeout( () => this.myChar._attacking = false, 600)
            this._changeFocusTimeOut = setTimeout( () => this.focusOn = null, 6000)
            this.recalMeeleDmg()
        })
        throwBtn.addEventListener("click", () => {
            if(this.myChar.mode !== "weapon") return this._statPopUp("You must hold a weapon")
            closeGameUI()
            this.stopPress()
            this.myChar.mode = "noneweapon"
            this.stopAnim(this.myChar.anims, "running", true)
            this.playAnim(this.myChar.anims, "throw")

            const myCurSword = this.myChar.swordz.find(swrd => swrd.name.split(".")[1] === this.det.weapon.name)
            if(!myCurSword) return log("current sword not found")
            const weaponDetail = this.det.items.find(itm => itm.meshId === this.det.weapon.meshId)
            if(!weaponDetail) return log("weapon not found")
            myCurSword.addRotation(Math.PI,0,0)
            log("cur sowrd " + myCurSword )
            if(this.socketAvailable) this.socket.emit("action-willthrow", {_id:this.det._id, weaponName: this.det.weapon.name})
            
            setTimeout(() => this.myChar.whoopS.play(), 900)
            setTimeout( async () => {
                const infrontPos = this.getMyPos(this.myChar.bx, 1)
                const infrontPosX2 = this.getMyPos(this.myChar.bx, 3)
                let myDmg = this.recalMeeleDmg()
                myDmg = myDmg * 5
                log('damage of spear ' + myDmg)
                const myPpos = this.myChar.bx.position
                if(this.socketAvailable){
                    this.socket.emit("will-throw", { _id: this.det._id, myFosNow: {x: myPpos.x, z: myPpos.z} , mode:this.myChar.mode, dmg: myDmg, frontPos: {x:infrontPos.x,z:infrontPos.z}, dirTa: { x: infrontPosX2.x,z:infrontPosX2.z}, weaponDetail, curPlace: this.currentPlace})
                }else{
                    this.createFlyingWeapon(this.myChar.bx.position, myDmg, this.myChar.mode, myCurSword, infrontPos, infrontPosX2, weaponDetail, this.det._id)
                    this.hideAllSword(this.myChar.swordz)
                    this.keepSword(this.myChar.rootSword, this.myChar.rootBone)
                }
                setTimeout(() => this.setMode("fist"), 400)
                // this.myChar.swordz = this.myChar.swordz.filter(swrd => swrd.name.split(".")[1] !== this.det.weapon.name)
                const theItem = this.det.items.find(itm => itm.meshId === this.det.weapon.meshId)
                await this.deductItem(theItem.meshId)
                this.det.weapon.name = "none"
                this.det.weapon.meshId = "none"
                this.changeAtkBtnImg()
                await this.updateMyDetailsOL(this.det, true)
                openGameUI()
                this.allCanPress()
                myCurSword.addRotation(-Math.PI,0,0)
            },950)
        })
        // kaya nandito tong restingInterval kase kelangan ko din sa cancelDoing
        let restingInterval
        cancelDoingBtn.addEventListener("click", async e => {

            if(this.targetRecource.name.includes("bed")){
                doingCont.style.display = "none"
                this.myChar.bx.parent = null
                this.myChar.bx.position = new Vector3(2,this.yPos,2.6)
                this.myChar.mode = "stand"
                openGameUI()
                this.allCanPress()
                this._allSounds.woodCreakS.play()
                if(this.det.storyQue.some(storyName => storyName === "wakingUp")){
                    closeGameUI()
                    this.stopPress()
                    this.myChar.mode = "none"
                    this.playAnim(this.myChar.anims, "standlooking")
                    const oneSpeechInStart = oneIntroSpeech.map(spch => spch.name === '' ? {...spch, name: this.det.name} : spch)
                    this.continuesSpeech(oneSpeechInStart, 0, 3000, () => {   
                        setTimeout(() => {
                            this.setQuestions(objectivesChoices, "What Do You Want To Know", (det) => {
                                this._allSounds.suspense1.attachToMesh(this.myChar.bx)
                                this._allSounds.suspense1.setPlaybackRate(.9 + Math.random()*.2)
                                this._allSounds.suspense1.play()
                                this.transCloseElem(questionCont, 2000)
                                let oneLastMesseg = [{name: "One", message: det.desc[0]}, {name: "One", message: det.desc[1]}, {name:"One", message: "I think I'm far enough, Choose Your Blessing ..."}]
                                
                                this.continuesSpeech(oneLastMesseg, 0, 3000, async () => {
                                    this.det.storyQue = this.det.storyQue.filter(strQ => strQ !== "wakingUp");
                                    await this.updateMyDetailsOL({...this.det,mainObj: { name: det.name, dn:det.dn} }, true);

                                    setTimeout(() => {
                                        const secMess = "There's a person waiting for you outside, He's expecting you"
                                        const thirdMess = "He will be guiding you in this world you're standing ..."
                                        const fourthMess = "Farewell ..."
                                        this.openBlessings(starterBlessings, [
                                            {
                                                name: "One",
                                                message: secMess
                                            },
                                            {
                                                name: "One",
                                                message: thirdMess
                                            },
                                            {
                                                name: "one",
                                                message: fourthMess
                                            }
                                        ], () => {
                                            this.allCanPress()
                                            openGameUI()
                                            this.myChar.mode = "stand"
                                            this.myChar.nameMesh.isVisible = true
                                            this.myChar.playerHealthMesh.isVisible = true
                                            setTimeout(() => tutorialCont.style.display = "flex", 1000)
                                        })
                                    }, 1500)
                                })
                            })
                        }, 3000)
                    })
                }
                return clearInterval(restingInterval)
            }
            //means we're sleeping on the ground wild
            if(this.myChar.mode === "onground" && !this.currentPlace.includes("apartment")){
                doingCont.style.display = "none"
                this.myChar.mode = "stand"
                openGameUI()
                this.allCanPress()
                this.myChar.bx.position.y = this.yPos
                log("waking up from bed leave")
                this.updateMyDetailsOL(this.det, false);
                return clearInterval(restingInterval)
            }
        })
        pacBtn.addEventListener("click", async e => {
            let recName
            let emitName
            let emitData
            clearInterval(this.hitRecourceInterval)
            if(this.targetRecource === undefined) return
            if(this.det.hp <= 0)return log("dead")
            if(this.targetRecource.name === "chair"){
                const chPos = this.targDetail
                const chrParentPos = this.targetRecource.parent.getAbsolutePosition()
                const prevPos = this.myChar.bx.position
                this.myChar.bx.position = new Vector3(chPos.x,this.yPos,chPos.z)
                this.myChar.bx.lookAt(new Vector3(chrParentPos.x, this.yPos, chrParentPos.z),0,0,0)
                this.myChar.mode = "sitting"
                this.openPopUpAction("cancel")
                this.targetRecource = "cancel-sit"
                this.targDetail = prevPos
                this.stopPress()
                closeGameUI()
                this.setRightUIs(["openstatus", "mystats", "myskills", "settingsIcon"])
                return
            }
            if(this.targetRecource === "cancel-sit"){
                const prevPos = this.targDetail
                this.myChar.bx.position = new Vector3(prevPos.x,this.yPos,prevPos.z)
                this.myChar.mode = "stand"
                this.allCanPress()
                openGameUI()
                return this.closePopUpAction()
            }
            if(this.targetRecource === 'merchant'){
                this.closePopUpAction()
                this.stopMyCharacter()
                clearTimeout(this._attackTimeout)
                this._allSounds.merchantV.play()
                this.continuesSpeech([{name: "Zeenan",message: "Hi I'm zeenan, A Traveling Merchant ..."}, {name: "Zeenan",message: "Maybe We Could Do Some Business ..."}],0,2500,() => {
                    setTimeout(() => merchantChoice.style.display = "flex", 2400)
                    this.setProperSound()
                }) 
                return
            }
            if(this.targetRecource === 'apartment'){

                apartCont.style.display = "flex"
                const { name, price, rentPrice } = this.targDetail
                apartName.innerHTML = name
                pRent.innerHTML = rentPrice

                apartInfos.style.display = "flex"
                aprtLoadingBx.style.display ="none"
                return
            }
            if(this.targetRecource === 'crafthouse'){
                this.stopPress()
                log(this.myChar.anims)
                apartInfos.style.display = "none"
                aprtLoadingBx.style.display ="block"
                
                aprtLoadLabel.innerHTML = "Entering Shop..."
                await this.updateMyDetailsOL({...this.det, currentPlace: 'crafthouse', x: 0, z: 0 }, true)
                this.socket.emit("dispose", {_id:this.det._id, place: this.currentPlace})
                
                return await this._goToCraftHouse()
            }
            if(this.targetRecource === 'drink-eat'){
                this.stopPress(true)
                this.animStopAll(this.myChar, ['walk', 'running'])
                closeGameUI()
                const questionsCraftHouse = [
                    {
                        name: "chooseMenu",
                        dn: "Choose Menu",
                        desc: ["Oh ho there is plenty of booze here", "Just choose here"],
                    },
                    {
                        name: "newNews",
                        dn: "Here some news",
                        desc: ["You heard about the sss rank carl ?", "Yeah , He died in the dungeon floor 7"],
                    },
                    {
                        name: "cancel",
                        dn: "Nevermind",
                    },
                ]
                this.setQuestions(questionsCraftHouse, "How Can I Help You ?", det => {
                    questionCont.classList.add("transClose");
                    setTimeout(() => questionCont.style.display="none",500)
                    openGameUI()
                    this.allCanPress()
                    
                    if(det.name === "cancel") return log("okay nevermind")
                    
                    this.continuesSpeech([ { name: "Bartender", message: det.desc[0]},{ name: "Bartender", message: det.desc[1]}, ], 0, 2500, () => {
                        log("open crafting box")
                        if(det.name === "newNews") return log("okay news finished")
                        const toSellInBar = ["liquor", "meatcooked"]
                        const theFoodsInBar = []
                        records.forEach(rec => {
                            toSellInBar.forEach(barfoodN => {
                                if(rec.name.toLowerCase().includes(barfoodN.toLowerCase())){
                                    theFoodsInBar.push({...rec, price: rec.origPrice})
                                }
                            })
                        })
                        setTimeout(() => this.setToBuyItems(theFoodsInBar), 1500)
                    })
                })
                return
            }
            if(this.targetRecource === 'craft-table'){
                this.stopPress(true)
                this.animStopAll(this.myChar, ['walk', 'running'])
                closeGameUI()
                const questionsCraftHouse = [
                    {
                        name: "craftNewWeapon",
                        dn: "Craft Items",
                        desc: ["The Items We Can Craft depends on what cores you have", "And a small fee for the dwarvesmen ..."],
                        displayCap: "Choose Crafting Material"
                    },
                    {
                        name: "fixEnhanceItem",
                        dn: "Fix Enhance Weapon",
                        desc: ["Enhancing and Fixing Items requires risk", "We cannot guarantee the Item's Success"],
                        displayCap: "Select Item To Fix and Enhance"
                    },
                    {
                        name: "cancel",
                        dn: "Nevermind",
                    },
                ]
                this.setQuestions(questionsCraftHouse, "How Can I Help You ?", det => {
                    questionCont.classList.add("transClose");
                    setTimeout(() => questionCont.style.display="none",500)
                    openGameUI()
                    this.allCanPress()
                    
                    if(det.name === "cancel") return log("okay nevermind")
                    
                    this.continuesSpeech([ { name: "Smythe", message: det.desc[0]},{ name: "Smythe", message: det.desc[1]}, ], 0, 2500, () => {
                        log("open crafting box")
                        setTimeout(() => this.setCraftOrFixing(det.displayCap, "core", det.name), 1500)
                    })
                })
                return
            }
            if(this.targetRecource === 'guildhouse'){
                this.stopPress()
                apartInfos.style.display = "none"
                aprtLoadingBx.style.display ="block"
                this.closePopUpAction()
                
                aprtLoadLabel.innerHTML = "Entering Guild..."
                const myfos = this.myChar.bx.position
                await this.updateMyDetailsOL({...this.det, currentPlace: 'guildhouse', x: myfos.x, z: myfos.z }, true)
                this.socket.emit("dispose", {_id:this.det._id, place: this.currentPlace})
                
                return await this._goToGuildHouse(`guildhouse`)
            }
            if(this.targetRecource === 'guild'){
                this.stopPress(true)
                this.animStopAll(this.myChar, ['walk', 'running.fist', 'running.weapon'])
                guildCont.style.display = "flex"
                if(this.det.rank === "none"){
                    this.closePopUpAction()
                    claimBtn.style.display = "none"
                    guildSellItems.style.display = "none"
                    guildBtn.innerHTML = 'Yes'
                    guildTtle.innerHTML = `Register As Adventurer ?`;
                }else{
                    this.allCanPress()
                    claimBtn.style.display = "block"
                    guildSellItems.style.display = "block"
                    guildBtn.innerHTML = 'check quests'
                    guildTtle.innerHTML = `How can I help you ?`;
                }
                this.setProperSound()
                return log(this.det.rank)
            }
            if(this.targetRecource.name === 'bonfire'){
                this.closePopUpAction()
                cookCont.style.display = "flex"
                toCookList.innerHTML = ''
                let rawFoods = 0
                this.det.items.forEach(item => {
                    
                    if(item.itemType === "food"){
                        const theFood = foodInfo.find(food => food.name === item.name)
                        if(!theFood) return log("not found the food in foodsinfo")
                        if(!theFood.raw) return log("not raw")
                        const newDiv = createElement('div', `tocook-bx ${item.name}`);
                        const newImg = createElement("img", "tocook-img")
                        newImg.src = `./images/loots/${item.name}.png`
                        const foodName = createElement("p", "food-name", `${theFood.dn}`)
                        const foodQnty = createElement("p", "food-qnty", `x${item.qnty}`)
                        
                        newDiv.append(newImg)
                        newDiv.append(foodName)
                        newDiv.append(foodQnty)
                        toCookList.append(newDiv)
                        rawFoods++
                    }
                })
                if(rawFoods === 0){
                    const newP = createElement("p", "nothing-tocook", "No Raw Food To Cook")
                    toCookList.append(newP)
                }
                return log("Time To Cook")
            }
            if(this.targetRecource.name === "bedleave"){
                this.closePopUpAction()
                this.stopPress()
                this.myChar._moving = false
                this.animStopAll(this.myChar, ['walk', 'running.fist', 'running.weapon'])
                apartCont.style.display = "none"
                doingCont.style.display = "block"
                doingName.innerHTML = 'Sleeping'
                cancelDoingBtn.innerHTML = 'wake up'
                closeGameUI()
                const blpos = this.targetRecource.position
                this.myChar.bx.position = new Vector3(blpos.x,blpos.y+.8,blpos.z)
                this.myChar.mode = "onground"
                clearInterval(restingInterval)
                restingInterval = setInterval(() => {
                    if(this.det.survival.sleep > 99) return clearInterval(restingInterval)
                    this.det.survival.sleep+=.2
                    this.closePopUpAction()
                },100)
                return log("we will sleep in the bedleave")
            }
            if(this.targetRecource.name.includes("bed")){
                this.closePopUpAction()
                this.stopPress()
                this.myChar._moving = false
                this.animStopAll(this.myChar, ['walk', 'running.fist', 'running.weapon'])
                apartCont.style.display = "none"
                doingCont.style.display = "block"
                doingName.innerHTML = 'Sleeping'
                cancelDoingBtn.innerHTML = 'wake up'
                closeGameUI()
                
                this.myChar.bx.parent = this.targetRecource
                this.myChar.mode = "onground"
                this.myChar.bx.position = new Vector3(0,1.2,0)
                clearInterval(restingInterval)
                restingInterval = setInterval(() => {
                    if(this.det.survival.sleep > 99)return clearInterval(restingInterval)
                    this.det.survival.sleep++
                },100)
                return
            }
            if(this.targetRecource.name.includes("npc")){
                this.closePopUpAction()
                const {x,z} = this.myChar.bx.position
                this.playerLookAt(this.myChar.bx, this.targetRecource.position)
                this._allSounds.normalV.play()

                if(this.targetRecource.name.includes("walker")){
                    this.targetRecource.lookAt(new Vector3(x, this.yPos,z),0,0,0)
                    simpleNpc = simpleNpc.map(npz => npz._id === this.targetRecource.name.split(".")[1] ? {...npz, _talking: true, _moving: false} : npz)
                    const theNpz = simpleNpc.find(npz => npz._id === this.targetRecource.name.split(".")[1])
                    if(!theNpz) return log("not found NPC")
                    this.stopAnim(theNpz.anims, 'walk')
                    this.stopMyCharacter()
                    clearTimeout(this._attackTimeout);
                    switch(theNpz.name){
                        case "jericho":
                            log("walker is jericho")
                            log(this.targDetail)
                            this.continuesSpeech(this.targDetail, 0, 2900, () => {
                                setTimeout( async () => {
                                    let notifTimeOut = 500
                                    if(this.craftToLearn !== undefined){
                                        this.craftToLearn.forEach(crft => {
                                            this.det.mycrafts.push(crft)
                                        })
                                        
                                        await this.updateMyDetailsOL(this.det, true)
                                        this.craftToLearn.forEach(crft => {
                                            setTimeout(() => showNotif(`${crft.name} craft learned `, 6000), notifTimeOut);    
                                            notifTimeOut+= 1000
                                        })
                                        this.showSideNotif(craftIcon, "Craft Added", "sideLeftAnimate")
                                        this._allSounds.smallCongratsS.play()
                                    }
                                    openGameUI(this.det)
                                    log(this.det)
                                    simpleNpc = simpleNpc.map(npz => npz._id === this.targetRecource.name.split(".")[1] ? {...npz, _talking: false, _moving: true} : npz)
                                    this.playerLookAt(theNpz.bx, {...theNpz.dirTarg, y: this.yPos})
                                }, 3000)
                            })
                        break;
                        default:
                            this.continuesSpeech(this.targDetail, 0, 4000, () => {
                                log(this.targetRecource)
                                simpleNpc = simpleNpc.map(npz => npz._id === this.targetRecource.name.split(".")[1] ? {...npz, _talking: false, _moving: true} : npz)
                                const npzD = theNpz.dirTarg
                                theNpz.bx.lookAt(new Vector3(npzD.x, this.yPos, npzD.z),0,0,0)
                            })
                        break
                    }
                }else{
                    this.targetRecource.lookAt(new Vector3(x, this.yPos,z),0,0,0)
                    this.stopMyCharacter()
                    clearTimeout(this._attackTimeout)
                    const theTalkingNpc = simpleNpc.find(npz => npz._id === this.targetRecource.name.split(".")[1])
                    switch(theTalkingNpc.name){
                        case "Nick":
                            const notYetSpoken = this.det.storyQue.some(stryName => stryName === "firstFriend")
                            const initNickChoices = () => {
                                this.stopPress()
                                closeGameUI()
                                const lastSpeechConvo =  [
                                    {name: "Nick", message: "I hope this helps, Right now I can only give you few tips"}, 
                                    {name: "Nick", message: "Having a good meal and enough rest will keep your focus"}, 
                                    {name: "Nick", message: "I want you to get stronger and explore things in here"},
                                    {name: "Nick", message: "Try leveling up, explore the Village and outside the gate"},
                                    {name: "Nick", message: "Look for Jericho he can teach you some things in crafting"},
                                    {name: "Nick", message: "Right now I'm defending this village from the demon lords army"},
                                    {name: "Nick", message: "I know you want to help, but he sent you here because you have potential"},
                                    {name: "Nick", message: "Let's not waste that, You will accompany me when you're ready"},
                                    {name: "Nick", message: "I will find you again once you reached certain level"},
                                    {name: "Nick", message: "I know you're strong, Goodluck ..."},
                                ]
                                const friendLastSpeech = () => {
                                    this.stopPress()
                                    closeGameUI()
                                    setTimeout(() => {
                                        this.continuesSpeech(lastSpeechConvo, 0, 2500, () => {
                                            this.allCanPress()
                                            openGameUI()
                                        })
                                    }, 2000)
                                }
                                setTimeout(() => {
                                    this.setQuestions([
                                        {
                                            name: "sword",
                                            dn: "Weapon To Use"
                                        },
                                        {
                                            name: "cashAndPotion",
                                            dn: "Money",
                                            cash: 2000,
                                            potions: ['spotion', 'mpotion'],
                                            speech: [{name: "Nick", message: "You can use this potion If ever your life is in danger"}]
                                        },
                                        {
                                            name: "info",
                                            dn: "Information"
                                        },
                                        {
                                            name: "none",
                                            dn: "I'm Fine",
                                            speech: [{name: "Nick", message: "I'm Impressed, You are different from anybody ..."}, {name: "Nick", message: "I wish you good fortune in here ... Good luck"}]
                                        }
                                    ], "I Can Assist You With This", async (det) => {
  
                                        switch(det.name){
                                            case "sword":
                                                const theBonusItem = bonusItems[Math.floor(Math.random()*bonusItems.length)]
                            
                                                this.claimReward(theBonusItem, 400)
                                                friendLastSpeech()
                                            break
                                            case "info":
                                                const theBonusInfo = bonusInfos[Math.floor(Math.random()*bonusInfos.length)]
                                                setTimeout(() => {
                                                    this.continuesSpeech(theBonusInfo.speech("Nick"), 0, 5500, () => {
                                                        setTimeout(() => {
                                                            friendLastSpeech()
                                                        }, 4500)
                                                    })
                                                }, 1000)
                                            break
                                            case "cashAndPotion":
                                                this.det.coins += det.cash
                                                this.obtain('coin', det.cash, false)
                                                setTimeout(() => {
                                                    let rewardGap = 300
                                                    this.continuesSpeech([...det.speech, lastSpeechConvo], 0, 3000, () => {
                                                        det.potions.forEach(itmName => {
                                                            const theItm = records.find(recItm => recItm.name === itmName)
                                                            const newItem = {...theItm, price: theItm.secondPrice}
                                                            this.claimReward(newItem, rewardGap)
                                                            rewardGap+=400
                                                        })
                                                        setTimeout(() => {
                                                            friendLastSpeech()
                                                        }, 1500)
                                                    })
                                                }, 2000)
                                            break
                                            case "none":
                                                this.continuesSpeech([...det.speech,
                                                    {name: "Nick", message: "If you want to earn some experience and earn money, Register On A Guild"},
                                                    {name: "Nick", message: "But Be Careful Only Accept Quest that you think you can ..."},
                                                ], 0, 3000, () =>{
                                                    this.allCanPress()
                                                    openGameUI()
                                                })
                                                    
                                            break
                                        }
                                        this.transCloseElem(questionCont, 1000)
                                        this.det.storyQue = this.det.storyQue.filter(queName => queName !== "firstFriend")
                                        await this.updateMyDetailsOL(this.det, true);
                                    })
                                }, 3000)
                            }
                            this.continuesSpeech(this.targDetail, 0, 2900, notYetSpoken ? initNickChoices: undefined)
                        break
                        case "wiz":
                            this.continuesSpeech(this.targDetail, 0, 3000, () => {
                                setTimeout(() => {
                                    const potionItems = []
                                    const forSellingName = ['potion', 'antidote']
                                    records.forEach(rec => {
                                        forSellingName.forEach(name => {
                                            if(rec.name.toLowerCase().includes(name)) potionItems.push({...rec, price: rec.origPrice})
                                        })
                                    })
                                    this.setToBuyItems(potionItems)
                                }, 2000)
                            })
                        break;
                        default:
                            this.continuesSpeech(this.targDetail, 0, 4000, () => openGameUI())
                        break
                    }
                }
                
                return this.setWalkSound()
            }
            if(this.targetRecource.name.includes("scroll")){
                this.playAnim(this.myChar.anims, "pickup")
                setTimeout(() => {
                    this.obtainScroll()
                    setTimeout(() => this.targetRecource.dispose(), 500)
                }, 500)
                this.closePopUpAction()
                return
            }
            if(this.targetRecource.name.includes("flower")){
                this.playAnim(this.myChar.anims, 'willbow')
                this.closePopUpAction();
                closeGameUI();
                this.myChar.mode = 'none'
                this.playerLookAt(this.myChar.bx, this.targetRecource.position);
                this.stopPress()
                this.willHeadLoading(250, async () => {
                    openGameUI(this.det)
                    this.myChar.mode = 'stand'
                    this.allCanPress()
                    if(!this.targDetail.meshId) return this._statPopUp("Cannot Pick", 300, 'crimson');
                    const isStillThere = this.AllFlowerz.find(fl => fl.meshId === this.targDetail.meshId)
                    if(!isStillThere) return this._statPopUp("Flower Already Gone", 300, 'crimson');
                    const itemRecDet = records.find(rec => rec.name === this.targDetail.name)
                    
                    if(itemRecDet) this.obtain(itemRecDet.dn, 1, false)
                    
                    this.socketAvailable && this.socket.emit("pickFlower", {_id: this.det._id, meshId: this.targDetail.meshId })
                    if(!this.socketAvailable){
                        this.targetRecource = undefined
                        this.targetRecource.dispose()
                    } 
                    await this.addToInventory({...this.targDetail, qnty: 1});
                    this.checkItemsForQuest("edibles")
                    
                })
                return log("flower pickuping")
            }
            if(this.targetRecource.name.includes("sword")){
                this.playAnim(this.myChar.anims, 'pickup')
                this.closePopUpAction()
                const stillHere = this.lootz.some(lot => lot.meshId === this.targDetail.meshId)
                if(!stillHere){
                    this.targetRecource.dispose()
                    if(this.targetRecource.actionManager){
                        this.targetRecource.actionManager.dispose()
                        this.targetRecource.actionManager = null
                    }
                    if(this.targetRecource.getChildren()){
                        this.targetRecource.getChildren().forEach(mzs => mzs.dispose())
                    }
                    return  this._statPopUp("Item No Longer Here", 100, "red")
                }
                if(this.socketAvailable){
                    this.socket.emit("pickSword", {_id: this.det._id, meshId: this.targDetail.meshId, place: this.currentPlace })
                }else{
                    this.lootz = this.lootz.filter(lot => lot.meshId !== data.meshId)
                    theLootz = theLootz.filter(lot => lot.meshId !== data.meshId);
                    this._scene.meshes.forEach(mes => {
                        if(mes.name.includes("sword")) log(mes.name)
                    })
                    let disposingSword = []
                    this._scene.meshes.forEach(mes => {
                        if(mes.name.includes("sword")){
                            if(mes.name.split(".")[1] === data.meshId)disposingSword.push(mes)
                        }
                    })
                    log(`disposing sword `, disposingSword)
                }
                this.targetRecource.dispose()
                if(this.targetRecource.actionManager){
                    this.targetRecource.actionManager.dispose()
                    this.targetRecource.actionManager = null
                }
                if(this.targetRecource.getChildren()){
                    this.targetRecource.getChildren().forEach(mzs => mzs.dispose())
                }
                await this.addToInventory(this.targDetail)
                log(`I picked `, this.targDetail);
                
                const swordRec = records.find(rec => rec.name === this.targDetail.name)
                setTimeout(() => {
                    this.obtain(swordRec ? swordRec.dn : this.targDetail.name, 1, false)
                    
                    this.targetRecource = undefined
                }, 300)
                // deduct in lootz
                return log("sword has been pcikedup")
            }
            if(this.det.sp < 1) return log("not enought SP")

            const {x,z} = this.targetRecource.getAbsolutePosition()
            this.myChar.bx.lookAt(new Vector3(x, this.yPos,z),0,0,0)
            this.closePopUpAction()

            if(this.targetRecource.name.includes("trees")){
                if(this.det.weapon.name === "none") return this._statPopUp('required weapon', 500, "#f5f5f5")
                if(this.det.weapon.name.includes("spear")) return this._statPopUp('Spear Not Allowed', 500, "#f5f5f5")
                this.myChar.mode = "weapon"
                this.getSword(this.myChar.rootSword, this.myChar.rHand)
                this.myChar._training = true
                recName = 'wood'
                emitName = "userTrain"
            }
            if(this.targetRecource.name.includes("iron")){
                if(!this.det.weapon.name.includes("pickaxe")) return this._statPopUp('required pickaxe', 500, '#f5f5f5')
                this.myChar._minning = true
                this.myChar._training = false
                recName = 'iron'
                emitName = "userMine"
                this.getSword(this.myChar.rootSword, this.myChar.rHand)
            }
            if(this.targetRecource.name.includes("crystal")){
                if(!this.det.weapon.name.includes("pickaxe")) return this._statPopUp('required pickaxe', 500, '#f5f5f5')
                this.getSword(this.myChar.rootSword, this.myChar.rHand)
                this.myChar._minning = true
                this.myChar._training = false
                recName = 'crystal'
                emitName = "userMine"                
            }
            const mypos = this.myChar.bx.position
            emitData = {_id: this.det._id, dirTarg: {x,z}, pos: {x: mypos.x, z: mypos.z}, mode: this.myChar.mode };
            
            if(this.targetRecource.name.includes("treasure")){
                const theTreaz = this.Treasures.find(treas => treas.meshId === this.targDetail.meshId)
                if(!theTreaz) return log("the treasure no longor here")
                if(theTreaz.isOpening) {
                    this.closePopUpAction()
                    return this._statPopUp("someone is opening");
                }
                log("targDetail", this.targDetail)
                
                const {x,z} = this.myChar.bx.position
                const tresPos = this.targetRecource.position;

                if(this.socketAvailable) this.socket.emit("stop-dosomething", 
                {_id: this.det._id, 
                dirTarg:{x: tresPos.x,z:tresPos.z}, 
                mypos: {x,z}, dur: 4000,
                mode: "willbow" })

                !this.socketAvailable && this.willBow()
                this.myChar.bx.locallyTranslate(new Vector3(0,0,.2))
                this.Treasures.forEach(tre => {
                    if(tre.meshId === this.targDetail.meshId){
                        tre.isOpening = true 
                        tre.openingBy = this.det._id
                    }                    
                })
                emitName = 'will-open-treasure'
                emitData = {...emitData, mode: "none", openingBy: this.det._id, meshId: this.targDetail.meshId}
                
                this.willHeadLoading(250, async () => {
                    openGameUI(this.det)
                    this.myChar.mode = 'stand'
                    this.allCanPress()
                    this.socketAvailable && this.socket.emit('treasure-opened', {meshId: this.targDetail.meshId})
                    const theItemOnrec = records.find(recItm => recItm.name === this.targDetail.name)
                    await this.obtain(theItemOnrec ? theItemOnrec.dn : this.targDetail.name, 1, false)
                    this.targetRecource.dispose()
                    this.targetRecource = undefined
                    // this.Treasures = this.Treasures.filter(treasure => treasure.meshId !== this.targDetail.meshId)
                    await this.addToInventory({...this.targDetail, qnty: 1})
                })
            }
            log(emitData)
            this.socketAvailable && this.socket.emit(emitName, emitData)       
            
            if(this.targetRecource.name.includes("treasure")) return
            
            clearInterval(this.hitRecourceInterval)
            this.hitRecourceInterval = setInterval(() => {
                if(this.det.sp < 1){
                    this.myChar._minning = false
                    this.myChar._training = false
                    log("not enought SP")

                    if(this.socketAvailable){
                        const recPos = this.targetRecource.position
                        const curpos = this.myChar.bx.position
                        this.socket.emit("stop", {_id: this.det._id, dirTarg:{x: recPos.x,z:recPos.z}, mypos: {x: curpos.x,z:curpos.z} })
                    }
                    this._statPopUp("required stamina", 100, "yellow")
                    return clearInterval(this.hitRecourceInterval)
                }
                
                if(this.targetRecource === undefined){
                    log(this.targetRecource)
                    return clearInterval(this.hitRecourceInterval)
                }
                let targId 
                targId = this.targetRecource.name.split(".")[1]
                if(recName === "crystal"){
                    targId = this.targetRecource.name.split(".")[2]
                }
                this.myChar.weaponCol.position.y = -2
                this.recourceHits++
                log(this.recourceHits)

                let recDetail
                switch (recName) {
                    case "iron":
                        recDetail = this.Ores.find(oree => oree.meshId === targId)
                    break;
                    case "wood":
                        recDetail = this.Trees.find(puno => puno.meshId === targId)
                    break;
                    case "crystal":
                        recDetail = this.Crytalz.find(cryz => cryz.meshId === targId)
                    break;
                    default:
                    break;
                }                
                if(!recDetail){
                    log(recDetail)
                    return clearInterval(this.hitRecourceInterval);
                }
                if(this.recourceHits >= 10){
                    let emitName
                    let ItemsToReceive = [];
                    let intervalGap = 500
                    switch (recName) {
                        case "iron":
                            emitName = 'oreDeductHits' 
                            const addiItem = {meshId:makeRandNum(), qnty: 1, name: "stone", price: 3, itemType: "loot"};
                            
                            if(Math.random()*10 > 3) ItemsToReceive.push(addiItem)    
                            break;
                        case "wood":
                            emitName = 'treeDeductHits'
                            const addiIteem = {meshId:makeRandNum(), qnty: 1, name: "leaves", price: 3, itemType: "loot"};
                            if(Math.random()*10 > 3) ItemsToReceive.push(addiIteem)                    
                        default:
                            break;
                    }
                    if(this.socketAvailable) this.socket.emit(emitName, {_id: this.det._id, meshId: targId, place: this.currentPlace})
                    
                    if(recName === 'crystal'){                        
                        Math.random() > .5 && this.obtain(this.targetRecource.name.split(".")[1], 1, true)
                    }else{
                        log("will obtain NON Crystak")
                        const theItemDet = records.find(itm => itm.name === recName)
                        if(theItemDet){
                            ItemsToReceive.push({...theItemDet, price:theItemDet.secondPrice, qnty: 1, meshId: makeRandNum() })
                            ItemsToReceive.forEach(itmx => {
                                this.claimReward(itmx, intervalGap)
                                intervalGap+=500
                            })
                        }
                    }                    
                    this.recourceHits = 0
                }
                const toDeductSpAndItem = 5
                this.det.sp-=toDeductSpAndItem
                if(this.det.weapon.cState > 1){
                    this.det.weapon.cState-=toDeductSpAndItem
                    const affectedItem = this.det.items.find(myItm => myItm.meshId === this.det.weapon.meshId)
                    if(affectedItem) affectedItem.cState-=toDeductSpAndItem
                }
                this.updateLifeManaSpGUI()
            }, 600)
        })        
        acceptQuestBtn.addEventListener("click", async () => {
            log(rewardInfo)
            log("my rank " + this.det.rank)
            // take the quest
            // after taking delete the quest
            rewardInfoCont.style.display = "none"
            if(this.det.quests.length >= 1) return this.showTransaction("Finish Your Current Quest", 2000)
            if(parseInt(this.det.rank)+2 <= parseInt(rewardInfo.requiredRank)) return this.showTransaction(`Your Rank Is Low For This`, 2000)
            this.cannotBeClick([questCont])
            this.showTransaction("Registering Quest ...", false)
            try {
                await this.delQuestFromMain(rewardInfo._id)
                const myUpdatedInfo = await this.useFetch(`${APIURL}/characters/myquest/add/${this.det._id}`, "PATCH", this.token, {...rewardInfo, isCleared: false});
                log(myUpdatedInfo) // In the backend I only save my quests not my life not my positions
                await this.setUpQuest();
                this.showTransaction("Quest Registration Approved", 2300)
                this._allSounds.itemEquipedS.play()
                this.returnClick([questCont])
                this.det.quests = myUpdatedInfo.quests
            } catch (error) {
                log(error)
                this.showTransaction("Register Quest Failed", 2300)
            }
        })
        deleteQuestBtn.addEventListener("click", async () => {
            log(rewardInfo)
            // take the quest
            // after taking delete the quest
            rewardInfoCont.style.display = "none"
            this.showTransaction("Abandoning Current Quest ...", false)
            try {
                // adding the quest from the Global Quests
                delete this.det.quests[0].isCleared
                this.det.quests[0].currentNumber=0
                log("to be deleted")
                log(this.det.quests[0])
                await this.useFetch(`${APIURL}/quests/save`, "POST",undefined, this.det.quests[0])              
                // setting my quest to zero
                this.det.quests = []
                await this.updateMyDetailsOL(this.det, true)
                this.showTransaction("Quest Abandoned", 2300)
                this.setHTMLUI(this.det)
                this.showMyAdventurerDetails()
                this._allSounds.itemEquipedS.play()
            } catch (error) {
                log(error)
                this.showTransaction("Register Quest Failed", 2300)
            }
        })
        equipedItemsCont.style.display = "flex"
        equipedList.forEach(elem => {
            elem.addEventListener("click", async e => {
                if(e.target.id === " ") return log("no equiped")
                if(e.target.id === "noequiped") return log("no equiped")
                const itemName = e.target.id
                const itemInfo = records.find(rec => rec.name === itemName)
                if(!itemInfo) return log("item not found")
                itemInfoCont.style.display = "block"
                itemInfoImg.src = `./images/loots/${itemInfo.name}.png`
                itemInfoName.innerHTML = itemInfo.dn
                itemDesc.innerHTML = itemInfo.desc 

                itemInfoBtns.innerHTML = ''
                log(this.det.items)
                const aBtn = createElement("button", "unequip item-infobtn", "UnEquip", () => {
                    itemInfoCont.style.display = "none"
                    this.unEquip(itemInfo)
                })

                itemInfoBtns.append(aBtn)
                if(itemInfo.itemType === "sword"){
                    const dropBtn = createElement("button", "equipsword item-infobtn", "Drop", async () => {
                        itemInfoCont.style.display = "none"
                        closeGameUI()
                        this.stopPress() 
                        this.myChar.inVulnerable = true
                        await this.deductItem(this.det.weapon.meshId, 1);
                        if(this.socketAvailable){ // only for animation
                            this.socket.emit("will-drop-sword", {
                                _id: this.det._id,
                                place: this.currentPlace
                            })
                        }else{
                            this.myChar.mode = "none"
                            this.getSword(this.myChar.rootSword, this.myChar.rHand)
                            this.playAnim(this.myChar.anims, "willStruck")
                            this.myChar.rootSword.addRotation(Math.PI,0,0)
                        }
                        const theSwordMyHand = this.myChar.swordz.find(sword => sword.name.split(".")[1] === itemName)
                        const theLandGround = this._scene.getMeshByName("ground")
                        if(!theLandGround) return log("not found ground")
                        if(theLandGround && theSwordMyHand){
                            this.myChar.soundColl.actionManager = new ActionManager(this._scene)
                            this.toRegAction(this.myChar.soundColl, theLandGround, async () => {
                                log("collided on ground")                              
                                const swordPOS = this.myChar.soundColl.getAbsolutePosition()
                                const swordData = {...this.det.weapon,
                                 x:swordPOS.x,z:swordPOS.z, qnty: 1,
                                place: this.currentPlace}
                                
                                if(this.socketAvailable){
                                    this.socket.emit("sword-isdroped", {
                                    _id: this.det._id,
                                    swordData})
                                }else{                                    
                                    this.struckTheSword(this.myChar,theSwordMyHand)
                                    this.placeSword(swordData, theSwordMyHand, .25, this._scene)
                                }                                

                                this.myChar.soundColl.actionManager.dispose()
                                this.myChar.soundColl.actionManager = null
                                this.unEquip(itemInfo, true)

                                // theSwordMyHand.isVisible = false
                                setTimeout(() => {
                                    this.myChar.mode = "fist"
                                    openGameUI()
                                    this.allCanPress()
                                    this.myChar.inVulnerable = false
                                }, 1000)
                                await this.updateMyDetailsOL(this.det, true)
                                log(this.det)
                            })
                        }
                        // await this.updateMyDetailsOL(this.det,true);
                        // this.setEquipedItems()
                        // this.setInventory()
                        // this.socketAvailable && this.socket.emit("equipingSword", {_id: this.det._id, swordDetail: theItemDetail, mode: this.myChar.mode})  
                    })
                    itemInfoBtns.append(dropBtn)
                }
            })
        })
        toCookList.addEventListener("click", async e => {
            if(e.target.className === 'tocook-list') return log('teturn')
            this.myChar.anims.forEach(anim => anim.stop())
            const foodName = e.target.className.split(" ")[1]
            const foodDet = foodInfo.find(food => food.name === foodName)
            const itemDet = this.det.items.find(food => food.name === foodName)
            if(!foodDet) return alert('not found food');
            if(!itemDet) return alert('not found food in items');

            cookCont.style.display = "none"
            this.playerLookAt(this.myChar.bx, this.targetRecource.position)
            this.willBow()
            await this.deductItem(itemDet.meshId,1)
            setTimeout( async () => {
                let theFoodName
                let theFoodDN
                openGameUI(this.det)
                this.allCanPress()
                this.myChar.mode = "stand"
                switch(foodDet.name){
                    case "minMeatRaw":
                        theFoodName = 'minMeatCooked'
                        theFoodDN = 'Minotaur meat'
                    break
                    case "rabbitMeatRaw":
                        theFoodName = 'rabbitMeatCooked'
                        theFoodDN = 'Rabbit meat'
                    break
                }
                await this.addToInventory({...itemDet, meshId:makeRandNum(), name: theFoodName, qnty: 1})
                this.obtain(theFoodDN, 1, false)
            }, 4500)
        });
        cancelBuy.addEventListener("click", e => apartCont.style.display = "none")
        cancelParents.forEach(btn => btn.addEventListener("click", e => {
            e.target.parentElement.style.display ="none"
            if(this.targetRecource === "guild") this.allCanPress()
        }))
        closeBtn.forEach(clsBtn => {
            clsBtn.addEventListener("click", e => {
                e.target.parentElement.style.display = "none"
            })
        })
        guildBtn.addEventListener("click", async e => {
            switch(this.targDetail.title){
                case "registration":
                    if(this.det.rank !== "none") return log("already registered " + this.det.rank);
                    const speech = [{name: 'reception', message: "To Register ...place hand on the book"},
                    {name: 'reception', message: "Registering you through your mana is essential"},
                    {name: 'reception', message: "we will check if you have an aptitude for magic"},
                    {name: 'reception', message: "It will take some time ... "},
                    ]
                    closeGameUI()
                    this.stopPress()
                    this.continuesSpeech(speech, 0, false, () => {
                        setTimeout(() => {
                            speechCont.classList.add("speech-close")
                            speechCont.innerHTML = ''
                            this.myChar.mode = "focusing"
                            this.playAnim(this.myChar.anims, "focusing", true)
                            setTimeout(() => {
                                let backPosition = -.6
                                let scaleSizeDura = 330
                                let showingDura = 500
                                this.det.aptitude.forEach(apt => {
                                    const thePos = this.getMyPos(this.myChar.bx, backPosition)
                                    const theRgb = rgbColors.find(rgbDet => rgbDet.name.includes(apt.name))
                                    if(!theRgb) return log("no aptitude for " + apt.name)
                                    setTimeout(() => {
                                        this.createNewCircle(theRgb.rgb, {x: Math.PI/2, y: 0, z: 0}, {x: thePos.x, y: 1.2, z: thePos.z}, this.det._id, scaleSizeDura)
                                        scaleSizeDura = scaleSizeDura + 150
                                    }, showingDura)    
                                    backPosition = backPosition - .4
                                    showingDura += 700
                                })

                                setTimeout(() => {
                                    const myAptNames = []
                                    if(myAptNames.length > 1) myAptNames.splice(myAptNames.length - 1, 0, ' and ');
                                    
                                    this.det.aptitude.forEach(apt => myAptNames.push(apt.name))
                                    const secondSpeech =[
                                        {name: "reception", message: "Thank you for your cooperation ..."},
                                        {name: "reception", message: `Your magic aptitude is ${myAptNames.join(" ")}... Impressive !`},
                                        {name: "reception", message: "You are now an official Adventurer of our guild"},
                                        {name: "reception", message: "You will start in lowest Rank, Rank F"},
                                        {name: "reception", message: "You can be promoted upto A or if you are that great"},
                                        {name: "reception", message: "You can be a rank S adventurer someday, Goodluck ..."},
                                        {name: "reception", message: "You can Inquire and check the quests in here ..."},
                                    ]
                                    this.myChar.mode = "stand"
                                    this.continuesSpeech(secondSpeech, 0, 4000, false)
                                    setTimeout( async () => {
                                        await this.updateMyDetailsOL({...this.det, rank: "0"}, true);
                                        showNotif('Adventurer Unlocked', 3000);
                                        this._allSounds.congratsS.play()
                                        openGameUI(this.det);
                                        this.allCanPress()
                                        this.openPopUpAction("speak")
                                        this.targetRecource = 'guild'
                                        this.targDetail = { title: "checkquest" }
                                        this.setHTMLUI(this.det)
                                    }, 3000)
                                }, 5000)
                            }, 4000)
                        }, 2000)
                    })
                break;
                case "checkquest":
                    this.showTransaction("Checking Quest", false)
                    await this.setUpQuest()
                    this.showTransaction("Quests Retrieved", 1500)
                    questCont.style.display = "flex"
                    questCont.classList.remove("trans-close")
                break
            }
            guildCont.style.display = "none"
        })
        guildSellItems.addEventListener("click", e => {
            this.setSellItems(this.det.items, ['weapon', 'shield', 'sword', 'helmet', 'gear'])
        })
        questList.addEventListener("click", e => {
            if(!e.target.className.includes("qst-bx")) return
            const questId = e.target.className.split(" ")[1]
            const questInfo = this.quests.find(qst => qst.questId === questId)
            if(!questInfo) return log("quest not found");
            if(questInfo.rank !== this.det.rank) return this._statPopUp('')
            this.questToTake = questInfo
            this.showScrollMess(questInfo.title, questInfo.def)
        })
        claimBtn.addEventListener("click", async e => {
            // claim rewards here
            let clearedQuestz = []
            this.checkItemsForQuest("edibles")
            this.det.quests.forEach(myqst => {
                if(myqst.isCleared) clearedQuestz.push(myqst)
            })
            if(!clearedQuestz.length) return this.showTransaction("No Finished Quest", 1000)
            closeGameUI()
            let intervalGap = 500
            this.transCloseElem(guildCont, 1000);
            claimBtn.style.display = "none"
            let itemReq = undefined
            clearedQuestz.forEach(myqst => {
                this.det.quests = this.det.quests.filter(qst => qst._id !== myqst._id)

                switch(myqst.reward.rewardType){
                    case "both":
                        log("reward type is both")
                        myqst.reward.rewardItems.forEach(itmName => {
                            const theItem = records.find(itmrec => itmrec.name === itmName)
                            this.claimReward({...theItem, price: theItem.secondPrice}, intervalGap)
                            intervalGap+=500
                        })
                        this.det.coins+=myqst.reward.rewardCoin
                        this.obtain('received coin', myqst.reward.rewardCoin, false)
                        this.det.clearedQuests.currPoints+=myqst.addPoints
                    break
                    case "cash":
                        log("reward type is cash only")
                        this.det.coins+=myqst.reward.rewardCoin
                        this.obtain('coin', myqst.reward.rewardCoin, false)
                        this.det.clearedQuests.currPoints+=myqst.addPoints
                        
                    break
                }
                if(myqst.questTarget.targetType === "edibles"){
                    const theItem = this.det.items.find(itm => itm.name === myqst.questTarget.targetName)
                    if(!theItem) log("item to be deduc is not found")
                    if(theItem){
                        log("need to deduct this item on your items")
                        itemReq = { details: theItem, qnty: myqst.demandNumber}
                    }
                }
                this.det.clearedQuests.totalCleared+=1
                log(`my currpoints ${this.det.clearedQuests.currPoints}`)
                this._allSounds.coinReceivedS.play()
                const pointLimit = (parseInt(this.det.rank)+1) * 100
                log("point limit is " + pointLimit)
                if(this.det.clearedQuests.currPoints >= pointLimit){
                    //increase rank
                    log(this.det.rank)
                    // const myrankDig = ranks.find(rnk => rnk.displayRank === this.det.rank)
                    // if(!myrankDig) return log("not found rank display")
                    this.det.rank = parseInt(this.det.rank)+1
                    this.det.rank = this.det.rank.toString()

                    this.det.clearedQuests.currPoints=0;
                    const myCurRank = ranks.find(rnk => rnk.rankDig === this.det.rank)
                    setTimeout(() => {
                        this.showTransaction(`You Are Promoted To Rank ${myCurRank.displayRank}`, 3000);
                        this._allSounds.congratsS.play()
                    }, 2500)
                }
            })
            await this.updateMyDetailsOL(this.det, true);
            if(itemReq) await this.deductItem(itemReq.details.meshId, itemReq.qnty)
            this.setHTMLUI(this.det)
            openGameUI(this.det)
            showNotif("quest cleared", 2000)
            this._allSounds.smallCongratsS.play()
        })
        craftImgs.forEach(btn => {
            btn.addEventListener("click", e => {
                const btnClassName = e.target.className.split(" ")[1]
                const myTarg = this.cam.getForwardRay().direction
                const myFPos = this.myChar.bx.position.add(new Vector3(myTarg.x, 0, myTarg.z))
                craftCont.style.display = "none"

                this.myChar.bx.lookAt(new Vector3(myTarg.x,this.yPos,myTarg.z),0,0,0)
                switch(btnClassName){
                    case "bonfire":
                        if(this.currentPlace.includes("apartment") || this.currentPlace.includes("guild") || this.currentPlace.includes("heartland")) return this.showTransaction("Not Allowed Here", 2400)
                        const myPrevMode = this.myChar.mode
                        const bonFPos = {x: myFPos.x,z:myFPos.z}
                        this.willBow()
                        const {x,z} = this.myChar.bx.position
                        if(this.socketAvailable) this.socket.emit("stop-dosomething", 
                        {_id: this.det._id, 
                        dirTarg:{x: myFPos.x,z:myFPos.z}, 
                        mypos: {x,z}, dur: 4000,
                        mode: "willbow" })
                        this.myChar.bx.lookAt(new Vector3(myFPos.x,this.yPos,myFPos.z),0,0,0)
                        this.willHeadLoading(400, () => {
                            openGameUI(this.det)
                            this.myChar.mode = 'stand'
                            this.allCanPress()
                            if(!this.socketAvailable) return this.craftBonFire(bonFPos)
                            if(this.socketAvailable) this.socket.emit("plant-bonfire", 
                            {meshId: makeRandNum(), pos: bonFPos, place: this.currentPlace });
                        })
                    break;
                }
            })
        })
        apartBtns.childNodes.forEach(elem => {
            if(!elem.className) return
            elem.addEventListener("click", async e=> {
                log(e.target.className)
                if(e.target.className.includes("rent")) return await this.rentOwnHouse(this.targDetail, false)
                await this.rentOwnHouse(this.targDetail, true)
            })
        })
        invList.addEventListener("click", e => {
            const itemId = e.target.id
            const theItemDetail = this.det.items.find(ite => ite.meshId === itemId)
            if(!theItemDetail) return log("item not found this.det.items")
            if(itemId === '') return
            this._allSounds.nextBtnS.play()
            itemInfoBtns.innerHTML = ''
            if(theItemDetail.itemType === "scroll"){
                
                itemInfoName.innerHTML = 'scroll'
                itemInfoImg.src = `./images/loots/scroll.png`
                itemDesc.innerHTML = 'you can use scroll to put information and read information from it'

                itemInfoBtns.innerHTML = ''           
                const throwBtn = createElement("button", "throw item-infobtn", "Throw", async () => {
                    itemInfoCont.style.display = "none"
                    await this.deductItem(theItemDetail.meshId, 1, true)
                })
                const readBtn = createElement("button", "read item-infobtn", "Read", async () => {
                    itemInfoCont.style.display = "none"
                    this.showScrollMess(theItemDetail.name)
                    await this.deductItem(itemId)
                    this.setInventory('recource')
                })
                itemInfoBtns.append(throwBtn)
                itemInfoBtns.append(readBtn)
                return itemInfoCont.style.display = "block"
            }
            if(theItemDetail.name.toLowerCase().includes("scroll")){
                const scrollDet = records.find(recitem => recitem.name === theItemDetail.name)
                if(!scrollDet) log("not found scroll det");

                const aBtn = createElement("button", "blackBtn item-infobtn", "open scroll",async () => {
                    if(this.det.race !== "human") return this.showTransaction("You cannot change Race anymore", 2000)
                    this.openScroll()
                    scrollDet.choices.forEach(card => {
                        const scrlBx = createElement("li", `scrl-bx`)
                        const scrlImg = createElement("img", `scrl-img`)
                        scrlImg.src = `./images/blessings/${card.imgName}.jpg`
                        const scrlName = createElement("p", `scrl-name`, card.dn)
                        scrlBx.append(scrlImg)
                        scrlBx.append(scrlName)
                        
                        switch(scrollDet.itemType){
                            case "raceChanger":                                
                                scrlBx.addEventListener("click", async () => {
                                    const raceName = card.dn.toLowerCase()
                                    if(this.det.race === raceName) return this.showTransaction(`Race is already ${raceName}`, 2000)
                                    this.showTransaction("Changing Race ...")
                                    this.closeScroll()
                                    log(card)
                                    this.playAnim(this.myChar.anims, "standlooking")
                                    const {hp,mp,sp,spd,sword,def,magic,core} = card.plusTo
                                    this.det.race = raceName
                                    this.det.hp+=hp
                                    this.det.maxHp+=hp
                                    this.det.mp+=mp
                                    this.det.maxMp+=mp
                                    this.det.sp+=sp
                                    this.det.maxSp+=sp
                                    this.det.stats.sword += sword
                                    this.det.stats.def += def
                                    this.det.stats.magic += magic
                                    this.det.stats.core += core
                                    this.det.stats.spd += spd
                                    const myCpos = this.myChar.bx.position
                                    this.det.x = myCpos.x
                                    this.det.z = myCpos.z
                                    this.myChar.spd += spd
                                    this.transformInto(this._scene,this.myChar._id,raceName, this.myChar.rootMesh, this.myChar.rHead, this.myChar.meshes, true)
                                    await this.updateMyDetailsOL(this.det, true)
                                    this.setHTMLUI(this.det)
                                    this.showTransaction(`Race Changed To ${card.dn}`, 2000)
                                    openGameUI()
                                })
                            break;
                        }
                        scrollList.append(scrlBx)
                    })
                    await this.deductItem(theItemDetail.meshId, 1) 
                    itemInfoCont.style.display = "none";
                    this.closePopUpAction()
                    setTimeout(() => {
          
                    }, 1500)
                })
                itemInfoBtns.append(aBtn)
        
            }
            const itemName = theItemDetail.name
            const itemInfo = records.find(rec => rec.name === itemName)
            log(itemInfo)
            if(!itemInfo) return log("item not found")

            itemInfoCont.style.display = "block"

            if(itemInfo.itemType === "seed"){
                itemInfoImg.src = `./images/loots/seed.png`
            }else{
                itemInfoImg.src = `./images/loots/${itemInfo.name}.png`
            }            
            itemInfoName.innerHTML = itemInfo.dn
            itemDesc.innerHTML = itemInfo.desc
            if(itemInfo.name.includes("liquor")){
                
                const aBtn = createElement("button", "plantseed item-infobtn", "drink",async () => {
                    if(!this.currentPlace.includes("club")) return this.showTransaction("drink inside tavern", 2500)
                    if(this.myChar.mode !== "sitting")return this.showTransaction("Sit and drink", 2500)
                    this.myChar.mode = "none"
                    this.stopAnim(this.myChar.anims, "drinkliquor")
                    this.playAnim(this.myChar.anims, "drinkliquor")
                    this.myChar.liquorMug.isVisible = true
                    this.det.survival.hunger += 12
                    this._allSounds.consumeS.play()
                    if(this.det.survival.hunger > 100) this.det.survival.hunger = 100
                    this.updateSurvival_UI()
                    profile.style.display = "none"
                    await this.deductItem(theItemDetail.meshId, 1) 
                    itemInfoCont.style.display = "none";
                    this.closePopUpAction()
                    setTimeout(() => {
                        if(Math.random() > .5){
                            this._allSounds.burp.setPlaybackRate(1 + Math.random()*.3)
                            this._allSounds.burp.play()
                        }else{
                            this._allSounds.ahhS.setPlaybackRate(1 + Math.random()*.3)
                            this._allSounds.ahhS.play()
                        }
                        this.myChar.liquorMug.isVisible = false
                        this.myChar.mode = "sitting"
                        this.openPopUpAction("cancel")
                    }, 1500)
                })
                itemInfoBtns.append(aBtn)
               return
            }
            const {plusDmg, plusDef, magRes, plusMag} = theItemDetail
            switch (theItemDetail.itemType) {
                case 'sword':
                    plusInfo.innerHTML = `dmg:${plusDmg}`
                break;
                case 'armor':
                    plusInfo.innerHTML = `def:${plusDef} Mag Ressistance:${magRes}`
                break;
                case 'gear':
                    plusInfo.innerHTML = `def:${plusDef} Mag Ressistance:${magRes}`
                break;
                case 'helmet':
                    plusInfo.innerHTML = `def:${plusDef} Mag Ressistance:${magRes}`
                break;
                case 'shield':
                    plusInfo.innerHTML = `def:${plusDef} Mag Ressistance:${magRes}`
                break;
                default:
                    plusInfo.innerHTML = ``
                break;
            }
            
            if(itemInfo.itemType === "seed"){
                const aBtn = createElement("button", "plantseed item-infobtn", "Plant", () => {
                    const {x,z} = this.myChar.bx.position
                    if(!this.socketAvailable) return this._statPopUp('cannot plant here', 500, '#f5f5f5')
                    if(this.socketAvailable){
                        this.socket.emit("plantSeed", {
                            _id: this.det._id, 
                            pos: `${x},${z}`, 
                            meshId: Math.random().toString(),
                            place: this.currentPlace,
                            dirTarg: {x: this.btf.position.x, z: this.btf.position.z}, 
                            hits: 2,
                            spawntype: "seed" 
                        })
                    }
                    this.playAnim(this.myChar.anims, "plantseed")
  
                    itemInfoCont.style.display = "none"
                    this.deductItem(theItemDetail.meshId, 1)
                })
                itemInfoBtns.append(aBtn)
            }
            if(itemInfo.itemType === "food" && !itemInfo.name.includes("liquor")){
                let nameOfBtn = "Eat"
                let soundOfConsume
                let isCuring = false
                const theFood = foodInfo.find(food => food.name === itemInfo.name)
                if(!theFood) return log("food not found")
                const foodNameLower = theFood.name.toLowerCase()
                if(theFood.name.includes("potion") || foodNameLower.includes("antidote")){
                    nameOfBtn = "use"
                    soundOfConsume = this._allSounds.consumeS
                }else{
                    soundOfConsume = this._allSounds.eatSolidS
                }
                const aBtn = createElement("button", "plantseed item-infobtn", nameOfBtn,async () => {
                    
                    if(!theFood) return log("food not found")
                    if(!theFood.name.includes("potion")){
                        if(foodNameLower.includes("antidote")){
                            isCuring = true
                            this.det.status = this.det.status.filter(stat => stat.effectType !== theFood.cureFor)
                            log("my status ", this.det.status)
                            this.showTransaction("Processing Antidote ...", false)
                        }else{
                            //means ordinary food
                            const plusHealth = this.det.maxHp * theFood.plusHealth
                            this.det.hp += plusHealth
                            this.det.survival.hunger += parseInt(theFood.plus);
                        }
                    }else{
                        //means potion
                        this.det.hp += theFood.plus
                    }
                    if(soundOfConsume){
                        soundOfConsume.setPlaybackRate(.9 + Math.random()*.2)
                        soundOfConsume.play()
                    }
                    if(this.det.hp > this.det.maxHp) this.det.hp = this.det.maxHp-1
                    this.updateSurvival_UI()

                    if(this.det.survival.hunger > 100) this.det.survival.hunger = 100
                    
                    this.setNegativeStatUI()
                    this.updateLifeManaSpGUI()
                    this.updateLifeMesh();
                    log(theItemDetail.meshId)
                    await this.deductItem(theItemDetail.meshId, 1) 
                    if(isCuring){
                        await this.updateMyDetailsOL(this.det, true)
                        this.showTransaction("Antidote Processed", 3000)
                        isCuring = false
                    }     
                    itemInfoCont.style.display = "none";
                })
                itemInfoBtns.append(aBtn)
            }
            if(itemInfo.itemType === "sword"){
                const throwBtn = createElement("button", "throw item-infobtn", "Throw", async () => {
                    itemInfoCont.style.display = "none"
                    await this.deductItem(theItemDetail.meshId, 1)
                    const checkSword = this.det.items.some(item=>item.name === this.det.weapon.name)
                    if(!checkSword){
                        this.det.weapon.name = "none"
                        this.hideAllSword(this.myChar.swordz)
                        this.setInventory("recource")
                        log(this.det)
                        log("your equiped sword is thrown")
                        await this.useFetch(`${APIURL}/characters/updateweapon/${this.det._id}`, "PATCH", this.token, this.det.weapon)
                        this.socketAvailable && this.socket.emit("unShowSword", {_id: this.det._id, swordName: itemName})
                    }
                    this.checkIfHaveWeapon()
                })
                itemInfoBtns.append(throwBtn)
                const aBtn = createElement("button", "equipsword item-infobtn", "Equip", async () => {
                    itemInfoCont.style.display = "none"

                    const isSwordExist = this.myChar.swordz.some(sword => sword.name.split(".")[1] === itemName)
                    if(!isSwordExist){
                        const updatedSwordz = this.myChar.createSword(itemName)
                        this.myChar.swordz = updatedSwordz
                        log("sword creation complete")
                    } 
                    
                    this.makeSwordVisible(this.myChar.swordz, theItemDetail.name)
                    // await this.useFetch(`${APIURL}/characters/updateweapon/${this.det._id}`, "PATCH", this.token, theItemDetail)
                    log("before equiping ", this.det.weapon)
                    this.det.weapon = theItemDetail
                    log("I will equip this " , this.det.weapon)
                    this.checkIfHaveWeapon()
                    
                    await this.updateMyDetailsOL(this.det,true);
                    this.setEquipedItems()
                    this.setInventory()
                    this.socketAvailable && this.socket.emit("equipingSword", {_id: this.det._id, swordDetail: theItemDetail, mode: this.myChar.mode})  
                    log(this.det.weapon)
                    log(this.det.items)
                    
                })
                itemInfoBtns.append(aBtn)
                return
            }
            if(itemInfo.itemType === "shield"){
                const throwBtn = createElement("button", "throw item-infobtn", "Throw", async () => {
                    itemInfoCont.style.display = "none"
                    await this.deductItem(theItemDetail.meshId, 1)
                    const checkSword = this.det.items.some(item=>item.name === this.det.shield.name)
                    if(!checkSword){
                        this.det.shield.name = "none"
                        this.hideAllSword(this.myChar.myshieldz)
                        this.setInventory("recource")
                        await this.updateLocOnline(this.det, true)
                    }
                })
                itemInfoBtns.append(throwBtn)
                const aBtn = createElement("button", "equipsword item-infobtn", "Equip", async () => {
                    itemInfoCont.style.display = "none"

                    const isSwordExist = this.myChar.myshieldz.some(sword => sword.name.split(".")[1] === itemName)
                    if(!isSwordExist){
                        const updatedShieldz = this.myChar.createShield(itemName)
                        this.myChar.swordz = updatedShieldz
                        log("shield creation complete")
                    } 
                    
                    this.makeSwordVisible(this.myChar.myshieldz, theItemDetail.name)
                    // await this.useFetch(`${APIURL}/characters/updateweapon/${this.det._id}`, "PATCH", this.token, theItemDetail)
                    this.det.shield = theItemDetail
                    await this.updateMyDetailsOL(this.det,true);
                    this.setEquipedItems()
                    this.setInventory()
                    this.socketAvailable && this.socket.emit("equipingShield", {_id: this.det._id, itemDetail: theItemDetail, mode: this.myChar.mode})
                })
                itemInfoBtns.append(aBtn)
                return
            }
            if(itemInfo.itemType === "helmet"){
                const throwBtn = createElement("button", "throw item-infobtn", "Throw", async () => {
                    itemInfoCont.style.display = "none"
                    await this.deductItem(theItemDetail.meshId, 1)
                    const checkHelmet = this.det.items.some(item=>item.name === this.det.helmet.name)
                    if(!checkHelmet){
                        this.det.helmet.name = "none"
                        this.hideAllSword(this.myChar.swordz)
                        this.setInventory("recource")
                        log(this.det)
                        log("your equiped sword is thrown")
                        await this.useFetch(`${APIURL}/characters/updateweapon/${this.det._id}`, "PATCH", this.token, this.det.weapon)
                        this.socket.emit("unShowSword", {_id: this.det._id, swordName: itemName})
                    }
                })
                itemInfoBtns.append(throwBtn)
                const aBtn = createElement("button", "equipsword item-infobtn", "Equip", async () => {
                    itemInfoCont.style.display = "none"

                    const isHelmetExist = this.myChar.myhelmetz.some(sword => sword.name.split(".")[1] === itemName)
                    if(!isHelmetExist){
                        const updatedHelms = this.myChar.createHelm(itemName)
                        this.myChar.myhelmetz = updatedHelms
                        log(`${itemName} creation complete`)
                    } 
                    
                    this.makeSwordVisible(this.myChar.myhelmetz, theItemDetail.name)
                    // await this.useFetch(`${APIURL}/characters/updateweapon/${this.det._id}`, "PATCH", this.token, theItemDetail)
                    this.det.helmet = theItemDetail
                    await this.updateMyDetailsOL(this.det,true);
                    this.setEquipedItems()
                    this.setInventory()
                    this.socketAvailable && this.socket.emit("equipingHelmet", {_id: this.det._id, itemDetail: theItemDetail, mode: this.myChar.mode})
                    log(this.det.helmet)
                    log(this.det.items)
                })
                itemInfoBtns.append(aBtn)
                return
            }
            if(itemInfo.itemType === "armor"){
                const throwBtn = createElement("button", "throw item-infobtn", "Throw", async () => {
                    itemInfoCont.style.display = "none"
                    await this.deductItem(theItemDetail.meshId, 1)
                    const checkArm = this.det.items.some(item=>item.name === this.det.armor.name)
                    if(!checkArm){ // kung wala na 
                        this.det.armor.name = "none"
                        this.hideAllSword(this.myChar.gearz)
                        this.setInventory("recource")
                        await this.updateMyDetailsOL(this.det,true);
                        this.socket.emit("unShowArmor", {_id: this.det._id, armorName: itemName})
                    }
                })
                itemInfoBtns.append(throwBtn)
                const aBtn = createElement("button", "equipsword item-infobtn", "Equip", async  () => {
                    itemInfoCont.style.display = "none"

                    this.makeSwordVisible(this.myChar.armorz, theItemDetail.name)
                    this.det.armor = theItemDetail
                    itemInfoCont.style.display = "none"
                    await this.updateMyDetailsOL(this.det,true);
                    this.setEquipedItems()
                    this.setInventory()
                    this.socketAvailable && this.socket.emit("equipArmor", {_id: this.det._id, armorDetail: theItemDetail, mode: this.myChar.mode})                    
                })
                itemInfoBtns.append(aBtn)
                return
            }
            if(itemInfo.itemType === "gear"){
                const throwBtn = createElement("button", "throw item-infobtn", "Throw", async () => {
                    itemInfoCont.style.display = "none"
                    await this.deductItem(theItemDetail.meshId, 1)
                    const checkArm = this.det.items.some(item=>item.name === this.det.gear.name)
                    if(!checkArm){ // kung wala na 
                        this.det.gear.name = "none"
                        this.hideAllSword(this.myChar.gearz)
                        this.setInventory("recource")
                        await this.updateMyDetailsOL(this.det,true);
                        this.socket.emit("unShowArmor", {_id: this.det._id, armorName: itemName})
                    }
                })
                itemInfoBtns.append(throwBtn)
                const aBtn = createElement("button", "equipsword item-infobtn", "Equip", async  () => {
                    itemInfoCont.style.display = "none"

                    this.makeSwordVisible(this.myChar.gearz, theItemDetail.name)
                    this.det.gear = theItemDetail
                    itemInfoCont.style.display = "none"
                    await this.updateMyDetailsOL(this.det,true);
                    this.setEquipedItems()
                    this.setInventory()
                    this.socketAvailable && this.socket.emit("equipGear", {_id: this.det._id, itemDetail: theItemDetail, mode: this.myChar.mode})                    
                })
                
                return itemInfoBtns.append(aBtn)
            }

            const throwBtn = createElement("button", "throw item-infobtn", "Throw", async () => {
                itemInfoCont.style.display = "none"
                await this.deductItem(theItemDetail.meshId, 1)
            })
            itemInfoBtns.append(throwBtn)
        })
        upgradeBtns.forEach(btn => {
            btn.addEventListener("click", e => {
                const parentId = e.target.parentElement.id
                this.upgrade(parentId, true)
            })
        })
        chatMinBtn.addEventListener('click', e => {
            const worldIcon = document.querySelector(".worldicon")
            if(worldChatCont.className.includes('slide-left')){
                worldChatCont.classList.remove('slide-left')
                chatMinBtn.innerHTML = '<<'
                chatMinBtn.classList.remove('slide-down')
                
                worldIcon.classList.add("vanish")
                return
            }
            worldIcon.classList.remove("vanish")
            worldChatCont.classList.add('slide-left');
            chatMinBtn.innerHTML = '>>'
            chatMinBtn.classList.add('slide-down')
        })
        sendBtn.addEventListener("click", e => {
            this.sendMessage(this.det.name, messageInp.value)
            messageInp.value = ''
        })
        modeOptCont.addEventListener("click", e => {
            const targName = e.target.id
            if(!targName) return log('no target')
            if(targName === 'pkMode')this.isPkMode = true
            if(targName === 'safeMode')this.isPkMode = false

            const optbxs = document.querySelectorAll(".opt-bx")
            optbxs.forEach(optbx => {
                optbx.children[0].classList.remove("on")
                if(optbx.id === targName){
                    if(!optbx.children[0].className.includes("on")) optbx.children[0].classList.add("on")
                }
            })
            log(this.isPkMode)
        })
        merchantChoice.addEventListener("click",e  => {
           const choiceName = e.target.className.split(" ")[1]
           if(!choiceName) return
           shopChoiceCont.style.display = "flex"
           switch (choiceName) {
               case 'buy':                   
                   this.setToBuyItems(this.targDetail)
                break;
                case 'sell':                    
                    this.setSellItems(this.det.items, ['core', 'flower'])
                 break;
                case 'cancel':
                    shopChoiceCont.style.display = "none"
                    merchantChoice.style.display = "none"
                    this.allCanPress()
               default:
                break;
           }
        })
        scrollBtns.addEventListener("click", async e => {
            const classN = e.target.className
            if(classN === 'scroll-btns') return
            const btnName= classN.split(" ")[1];

            scrollCont.style.display = "none"
            if(btnName === "decline") return this.openPopUpAction("speak")
            
            this.det.killQuest.push(this.questToTake)
            log(this.questToTake)
        })
        animateUpBtns.forEach(btn => {
            btn.addEventListener("click", e => {
                myStatContainer.classList.add("my-stat-hidding")
                settingsCont.classList.add("my-stat-hidding")
            })
        })

        settingsNav.addEventListener("click", e => {
            const settName = e.target.className
            if(!settName.includes("set-bx")) return
            const categName = settName.split(" ")[1]
            this.setSettingsUI(categName)
            settingsNav.childNodes.forEach(elem => {
                if(elem.className){
                    elem.classList.remove("sett-active")
                    if(elem.className.includes(categName)) elem.classList.add("sett-active")
                }
            })
        })
        signOutBtn.addEventListener("click", async () => {
            this.stopPress(true);
            closeGameUI()
            this.showTransaction("Saving ...");
            await this.updateMyDetailsOL(this.det, false)
            localStorage.clear();
            sessionStorage.clear()
            window.location.reload();
        })
    }
    // MAKE JOYSTICKSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS
    makeThumbArea(name, thickness, color, background, curves){
        let rect = new GUI.Ellipse();
            rect.name = name;
            rect.thickness = thickness;
            rect.color = color;
            rect.background = background;
            rect.paddingLeft = "0px";
            rect.paddingRight = "0px";
            rect.paddingTop = "0px";
            rect.paddingBottom = "0px";    
        
        return rect;
    }
    _makeJoyStick(socket,cam,scene, isSocketAvail){

        let adt = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        let xAddPos = 0;
        let yAddPos = 0;
        let xAddRot = 0;
        let yAddRot = 0;
        let sideJoystickOffset =  50;
        let bottomJoystickOffset = -50;
        let translateTransform                
    
        let leftThumbContainer = this.makeThumbArea("leftThumb", 2, "gray", null);
        leftThumbContainer.height = "120px";
        leftThumbContainer.width = "120px";
        leftThumbContainer.isPointerBlocker = true;
        leftThumbContainer.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        leftThumbContainer.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        leftThumbContainer.alpha = 0.3;

        leftThumbContainer.left = sideJoystickOffset;
        leftThumbContainer.top = bottomJoystickOffset;
    
        let leftPuck = this.makeThumbArea("leftPuck", 0, "blue", "black");
        leftPuck.height = "65px";
        leftPuck.width = "65px";
        leftPuck.isVisible = true
        leftPuck.left = 0
        leftPuck.isDown = true
        leftPuck.isPointerBlocker = true;
        leftPuck.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        leftPuck.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;

        leftThumbContainer.onPointerDownObservable.add(function(coordinates) {

            if(!canPress) return log("your canPress is false")
            // make it big
            sideJoystickOffset = -50
            bottomJoystickOffset = 50
            leftThumbContainer.height = "330px";
            leftThumbContainer.width = "330px";
            leftThumbContainer.left = sideJoystickOffset;
            leftThumbContainer.top = bottomJoystickOffset;
            // cam.setTarget(scene.getMeshByName(`box.${myId}`))
            leftPuck.isVisible = true;
            leftPuck.floatLeft = coordinates.x-(leftThumbContainer._currentMeasure.width*.5)-sideJoystickOffset;
            leftPuck.left = leftPuck.floatLeft;
            leftPuck.floatTop = adt._canvas.height - coordinates.y-(leftThumbContainer._currentMeasure.height*.5)+bottomJoystickOffset;
            leftPuck.top = leftPuck.floatTop*-1;
            leftPuck.isDown = true;
            leftThumbContainer.alpha = 0.1;
            leftPuck.alpha = 1

            const thebx = scene.getMeshByName("btf")
            if(!thebx){
                log("did not found the box")
            }else{
                const camD = cam.getForwardRay().direction
                const ourBot = scene.getMeshByName(`box.${myId}`)
        
                if(!ourBot) return log("ourBot undefined")
                const {x,z} = ourBot.position
                
                thebx.position = new Vector3(x,ourBot.position.y,z)
                const myPosWithAdd = ourBot.position.add(new Vector3(camD.x,0,camD.z))
                
                thebx.lookAt(new Vector3(myPosWithAdd.x,thebx.position.y,myPosWithAdd.z),0,0,0)
                
            }

        });

        leftThumbContainer.onPointerUpObservable.add(function(coordinates) {
     
            openGameUI()
            // make it small
            sideJoystickOffset = 50
            bottomJoystickOffset = -50
            leftThumbContainer.height = "120px";
            leftThumbContainer.width = "120px";
            leftThumbContainer.left = sideJoystickOffset;
            leftThumbContainer.top = bottomJoystickOffset;
            if(!canPress) return log("your canPress is false")               
            // const pos = scene.getMeshByName(`box.${myId}`).position
            // cam.setTarget(new Vector3(pos.x,pos.y,pos.z))

            xAddPos = 0;
            yAddPos = 0;
            leftPuck.isDown = false;
            leftPuck.isVisible = false;
            leftThumbContainer.alpha = 0.2;
            botMoving = false
            const me = players.find(pl => pl._id === myCharDet._id)
            if(!me) return log("I am not registered in players")
            me._moving = false
            me.runningS.stop()
            me.anims.forEach(anim => {
                if(anim.name.includes("running"))anim.stop()
                if(anim.name.includes("walk"))anim.stop()
            })
            
            const toEmit = {
                _id: userId,
                dirTarg: {x: bodyx, z:bodyz},
                mypos: curPos
            }

            if(isSocketAvail) socket.emit("stop", toEmit)
            // fetch(`${APIURL}/characters/updateloc/${myCharDet._id}`, apiOpt("PATCH", toEmit.mypos, tok))
        });
        
        leftThumbContainer.onPointerMoveObservable.add(function(coordinates) {
            if(!canPress) return log("your canPress is false")
            if (leftPuck.isDown) {
                closeGameUI()
                xAddPos = coordinates.x-(leftThumbContainer._currentMeasure.width*.5)-sideJoystickOffset;
                yAddPos = adt._canvas.height - coordinates.y-(leftThumbContainer._currentMeasure.height*.5)+bottomJoystickOffset;
                leftPuck.floatLeft = xAddPos;
                leftPuck.floatTop = yAddPos*-1;
                leftPuck.left = leftPuck.floatLeft;
                leftPuck.top = leftPuck.floatTop;

                xcor = xAddPos;
                zcor = yAddPos;

                const thebx = scene.getMeshByName("btf")
                const camD = cam.getForwardRay().direction
                const ourBot = scene.getMeshByName(`box.${userId}`)

                if(!ourBot) return log("ourBot undefined")
                const {x,z} = ourBot.position
                botMoving = true
                thebx.position = new Vector3(x,ourBot.position.y,z)
                const myPosWithAdd = ourBot.position.add(new Vector3(camD.x,0,camD.z))

                thebx.lookAt(new Vector3(myPosWithAdd.x,thebx.position.y,myPosWithAdd.z),0,0,0)
                if(!myCharDet.runningS.isPlaying){
                    if(myCharDet.mode === "weapon" || myCharDet.mode === "fist") myCharDet.runningS.play(0)
                } 
                if(isSocketAvail){
                    socket.emit("move", ({
                        mode: theGame.myChar.mode,
                        _id: userId,
                        dirTarg: {x: bodyx, z: bodyz}
                    }))
                }
            }       
        })

        adt.addControl(leftThumbContainer);
        leftThumbContainer.addControl(leftPuck);
        // leftThumbContainer.addControl(leftPuckCont);
        leftPuck.isVisible = true;
        // if(this._desktopMode)
        leftThumbContainer.isVisible = true

        this.leftThumbContainer = true
            
        return
    }
    setPlayerMode(player){
        switch(player.mode){
            case "stand":
                this.keepSword(player.rootSword, player.rootBone)
                this.stopAnim(player.anims, 'fight.idle')
            break
            case "weapon":
                this.getSword(player.rootSword, player.rHand)
            break
            case "fist":
                this.keepSword(player.rootSword, player.rootBone)
            break
        }
    }
    playerLookAt(body, targ){
        const {x,z} = targ
        body.lookAt(new Vector3(x, body.position.y ,z),0,0,0)
    }
    playAnim(animas, animName, isPermanent){
        if(isPermanent){
            animas.forEach(anim => {
                if(anim.name !== animName) anim.stop()
                if(anim.name !== animName){
                    anim.stop()
                }else{
                    anim.play()
                }
            })
            return
        }
        animas.forEach(anim => anim.name === animName && anim.play())
    }
    playAnimLoop(anims, animName){
        anims.forEach(anim => anim.name === animName && anim.play(true))
    }
    stopAnim(animas, animName, isIncludes){
        if(isIncludes){
            animas.forEach(anim => anim.name.includes(animName) && anim.stop())
            return
        }
        animas.forEach(anim => anim.name === animName && anim.stop())
    }
    async useFetch(address, meth, tok, theBody){
        try{
            const response = await fetch(address, apiOpt(meth, theBody, tok))
            const data = await response.json()
            return data
        }catch(err){
            log(err)
            return this.noInternet()
        }
    }
    initScripts(){        
        
    }
    // LOADING SCREENS
    loadingScreenNormal(){

    }
    loadingScreenTips(){

    }
    getSword(rootSword, hand){
        rootSword.parent = hand
        rootSword.rotation = new Vector3(0,-Math.PI/2 + .3,-Math.PI/2)
        rootSword.position = new Vector3(-.1,.4,0)
        rootSword.scaling = new Vector3(1.1,1.1,1.1)
    }
    keepSword(rootSword, back){
        rootSword.parent = back
        rootSword.rotation = new Vector3(-Math.PI+.1,0,-.35)
        rootSword.position = new Vector3(-.5,3,-.7)
        rootSword.scaling = new Vector3(1,1,1)
    }
    makeSwordVisible(swordz, swordName){
        swordz.forEach(sword => {
            if(sword.name.includes(swordName)){
                sword.isVisible = true
                if(sword.name.includes("glow")){
                    sword.getChildren().forEach(mes => mes.isVisible = true )
                }
                log(sword.name)
            }else{
                sword.isVisible = false
                if(sword.name.includes("glow")){
                    sword.getChildren().forEach(mes => mes.isVisible = false )
                }
            }
        })
    }
    hideMesh(meshez, itemName){
        meshez.forEach(msh => {
            if(msh.name.includes(itemName)){
                msh.isVisible = false
                if(msh.name.includes("glow")){
                    msh.getChildren().forEach(mes => mes.isVisible = false )
                }
            }
        })
    }
    // SPEECH RELATED
    speak(theSpeakerName, txtInside, dura, funcInNextBtn){
        speechCont.className.includes("speech-close") && speechCont.classList.remove("speech-close")
        speechCont.innerHTML = ''

        if(theSpeakerName) speechCont.append(createElement('p', 'speaker-name', theSpeakerName, false))         

        speechCont.append(createElement('p', 'speaker-speech', txtInside, false))

        if(dura){
            setTimeout(() => {
                speechCont.classList.add("speech-close")
            }, dura)
        }

        if(funcInNextBtn) speechCont.append(createElement('button', 'nextBtn', '>>', () => funcInNextBtn()))
    }
    continuesSpeech(arrayOfSpeech, startOfPage, dura, cb){
        
        speechCont.className.includes("speech-close") && speechCont.classList.remove("speech-close")
        speechCont.innerHTML = ''
        let startPage = startOfPage

        const speakerName = createElement('p', 'speaker-name', arrayOfSpeech[startPage].name, false)
        speechCont.append(speakerName)         
        speechCont.append(createElement('p', 'speaker-speech', arrayOfSpeech[startPage].message, false))
        if(speakerName.innerHTML === this.det.name){
            speakerName.style.left = "-10px"
        }else{
            speakerName.style.right = "-10px"
        }
        startPage++
        if(arrayOfSpeech.length > startPage){
            speechCont.append(createElement('button', 'nextBtn', '>>', () => {
                this._allSounds.nextBtnS.play()
                this.continuesSpeech(arrayOfSpeech, startPage, dura,cb)
            }))
        }else{
            if(cb) cb()
            if(dura){
                setTimeout(() => {
                    this.allCanPress()
                    speechCont.classList.add("speech-close")
                }, dura)
            }
        };
        
        
    }
    async gameOver(){              
        if(this.det.quests.length){
            await this.useFetch(`${APIURL}/quests/save`, "POST",undefined, {...this.det.quests[0], secKey: "rafadmin"})
            delete this.det.quests[0]._id
        }
        await this.useFetch(`${APIURL}/characters/delete/${this.det._id}`, "DELETE", this.token)
        
        setTimeout(() => {
            this.openStoryWritten(0, ['I Told You Not <br/> To Die', "You Died"], async () => {
                
                setTimeout(() => window.location.reload(), 4000)
            })
        }, 2000)
    }
    // ACTIONS WHEN HIT
    initMyDeath(){
        this.stopMyCharacter()
        this.det.hp = 0
        this.updateHP_UI()
        clearTimeout(this._enableKeyPessTimeout)

        if(this.socketAvailable) this.socket.emit("playerDied", {_id: this.det._id})

        Monsterz.forEach(mons => {
            if(mons.targHero === this.det._id){
                clearInterval(mons.intervalWillAttack)
                mons.isChasing = false
                mons.isAttacking = false
                mons.targHero = undefined
            }
        })
        if(!this.socketAvailable){
            Monsterz.forEach(mons => {                    
                clearInterval(mons.intervalWillAttack)
                mons.isChasing = false
                mons.isAttacking = false
                mons.targHero = undefined                    
            })
        }   
        
        //if(this.currentPlace !== "farmone") setTimeout(() => window.location.reload(), 5000)
        this.gameOver()
        this.playerDeath(this.myChar)
    }
    playerDeath(player){
        player._moving = false
        player._attacking = false
        player._minning = false
        this.animStopAll(player, ["walk", "running", "slash", "hit"], true)
        player.mode = "none"
        player.diedS.play()
        this.playAnim(player.anims, 'death', true)
        // player.meshes[0].parent = null
        const {x,y,z} = player.bx.position
        // player.meshes[0]. position = new Vector3(x,0,z)
        
        if(player._id === this.det._id){
            if(this.det.weapon.name === "none") return
            const theSwordMyHand = this.myChar.swordz.find(sword => sword.name.split(".")[1] === this.det.weapon.name)
            const swordPOS = this.myChar.soundColl.getAbsolutePosition()
            const swordData = {...this.det.weapon,
             x:swordPOS.x,z:swordPOS.z, qnty: 1,
            place: this.currentPlace}
                
            if(this.socketAvailable){
                this.socket.emit("sword-isdroped", {
                _id: this.det._id,
                swordData})
            }else{                                    
                this.struckTheSword(this.myChar,theSwordMyHand)
                this.placeSword(swordData, theSwordMyHand, .25, this._scene)
            }  
        }
    }
    stopFarming(thePlayer){
        thePlayer._minning = false
        thePlayer._training = false
        this.stopAnim(thePlayer.anims, "minning")
        this.stopAnim(thePlayer.anims, "upperkick")
    }
    animStopAll(thePlayer, arrayOfAnim, isIncludes){
        thePlayer._moving = false
        thePlayer._minning = false
        thePlayer._training = false
        thePlayer._attacking = false
        
        if(arrayOfAnim){
            arrayOfAnim.forEach(animName => {
                if(isIncludes){
                    thePlayer.anims.forEach(ani => ani.name.includes(animName) && ani.stop())
                }else{
                    this.stopAnim(thePlayer.anims, animName)
                }
                
            })
        }
    }
    stopMyCharacter(){
        this._canpress = false
        canPress = false
        botMoving = false
        this.animStopAll(this.myChar, ['walk', 'running'])
        this.myChar.mode = "stand"
        this.keepSword(this.myChar.rootSword,this.myChar.rootBone)
    }
    disposeAllActionM(ams){
        ams.forEach(am => {
            am.dispose()
            am = null
        })
    }
    demonIsHit(demonId, playerPos, dmgTaken, monspos, mode, isCritical){
        const theDemon = demons.find(dm => dm._id === demonId)

        theDemon.hp -= dmgTaken
        theDemon.lifeGui.width = `${(parseInt(theDemon.hp)/parseInt(theDemon.maxHp) * 100) * 4}px`;
        
        let monsHaveBlood = true
        switch(mode){
            case "weapon":
                theDemon.sliceHitS.setPlaybackRate(.9 + Math.random()*.3)
                theDemon.sliceHitS.play()
                if(monsHaveBlood) theDemon.bloodSplat && theDemon.bloodSplat.start()
                this.playAnim(theDemon.anims, "hit")
            break
            case "throw":
                log("throw")
                theDemon.spearStruck.setPlaybackRate(.9 + Math.random()*.3)
                theDemon.spearStruck.play()
                
                if(monsHaveBlood){
                    theDemon.bloodSplat && theDemon.bloodSplat.start()
                }
                this.playAnim(theDemon.anims, "hardhitpunch")
            break
            case "fist":
                // monster.punchedS.play()
                this.playAnim(theDemon.anims, "hitcenter")
            break
        }
        if(theDemon.hp <= 0) {
            this.focusOn = null
            this.det.monsterKilled++
            this.demonDied(demonId)

            const demonCore = records.find(rec => rec.for === theDemon.demonType)
            if(demonCore){
                const monsCoreItem = {...demonCore, price: demonCore.secondPrice, meshId: makeRandNum(), qnty: 1}
                
                this.addToInventory(monsCoreItem).then(() => {
                    this.obtain(monsCoreItem.dn,1,false)
                })
            }else{
                log("no demon core")
            }
        }
    }
    async demonDied(demonId){
        const demon = demons.find(mons => mons._id === demonId)
        if(!demon) return
        
        demon.mode = "none"
        demon.dieSound?.play()
        this.playAnim(demon.anims, 'death', true)
        const { humanDetector,
            longRangeCol,
            atkColl,
            weaponCol} = demon
        this.disposeAllActionM([humanDetector,
            longRangeCol,
            atkColl,
            weaponCol])
        demons = demons.filter(dm => dm._id !== demon._id);

        await this.expGain(demon.expGain)
    }
    monsterIsHit(monsId, playerPos, playerId, dmgTaken, monspos, mode, isCritical){
        const monster = Monsterz.find(mons => mons.monsId === monsId)
        if(!monster) return log("did not found the monster")
        
        monster.isHit = true
        
        let monsHaveBlood = true
        switch(mode){
            case "weapon":
                monster.sliceHitS.setPlaybackRate(.9 + Math.random()*.3)
                monster.sliceHitS.play()
                if(monster.monsName.includes("slime")) monsHaveBlood = false
                if(monster.monsName.includes("ghost")) monsHaveBlood = false
                if(monsHaveBlood){
                    switch(monster.monsName){
                        case "golem":
                            //will not create blood particle
                        break
                        default:
                            monster.bloodSplat && monster.bloodSplat.start()
                        break
                    }
                }
            break
            case "throw":
                log("throw")
                monster.spearStruck.setPlaybackRate(.9 + Math.random()*.3)
                monster.spearStruck.play()
                if(monster.monsName.includes("slime")) monsHaveBlood = false
                if(monster.monsName.includes("ghost")) monsHaveBlood = false
                if(monster.monsName.includes("golem")) monsHaveBlood = false
                if(monsHaveBlood){
                    monster.bloodSplat && monster.bloodSplat.start()
                }
            break
            case "fist":
                // monster.punchedS.play()
            break
        }
        // gumawa ako ng variable na hitTimeOut sa createtionNgMonster
        // at ginawa kong property para ma reuse ko pag clearTimeOut ko
        // kase ang monsterIsHit na function pag nag call gagawa na yan ng
        // panibagong timeout/ang function pag ni reuse icoclone niya yung code sa loob
        clearTimeout(monster.hitTimeOut)
        monster.hitTimeOut = setTimeout(() => monster.isHit = false, 800)
        // if(Math.random() > .2 && !isCritical) this.playAnim(monster.anims, Math.random() > .5 ? 'hit' : "hit1")
        this.playAnim(monster.anims, Math.random() > .5 ? 'hit' : "hit1")
        
        monster.hp -= dmgTaken
        monster.robHealthGui.width = `${(parseInt(monster.hp)/parseInt(monster.maxHp) * 100) * 4}px`;
        log(`monster rem hp ${monster.hp}`)
        const {x,z} = playerPos
        monster.body.position.x = monspos.x
        monster.body.position.z = monspos.z
        monster.body.lookAt(new Vector3(x,monster.body.position.y,z),0,0,0)

        if(isCritical){
            if(monster.monsName !== "slime") monster.weapon.position.y = 100
            this.stopAnim(monster.anims, "attack", true);

            const randN = Math.random() * 10
            this.playAnim(monster.anims, randN > 5 ? 'hit' : "hit1")
            this.addToBash({_id: monster.monsId, mesh: monster.body, bashPower: this.bigBash})
            const monsFos = monster.body.position
            this.createTextMesh(makeRandNum(), `critical ${dmgTaken}`, "red", {x: monsFos.x, y: monsFos.y, z: monsFos.z }, 91, this._scene, true, false)
        } 
        if(monster.hp <= 0){
            clearTimeout(monster.intervalWillAttack)
            this.stopAnim(monster.anims, 'hit', true);
            this.monsterDied(monsId)

            this.socketAvailable && this.socket.emit("monsDied", {monsId, place: this.currentPlace})
            this.removeToBash({_id: monster.monsId})
            Monsterz = Monsterz.filter(mons => mons.monsId !== monsId);
            
            if(this.myChar._id === playerId){
                log("yes it is Me who kill it")
                this.focusOn = null
                this.det.monsterKilled++

                log(`I will gain ${monster.expGain}`)
                // first level up
                this.expGain(monster.expGain).then(() => {
                    const lootForIt = monsterloot.filter( itmloot => itmloot.for === monster.monsName)
                    log("loots for this monster")
                    log(lootForIt)
                    const theItem = lootForIt[Math.floor(Math.random() * lootForIt.length)]
                    if(!theItem) log("the item is undefined")
                    
                    const monsCore = records.find(rec => rec.for === monster.monsName)
                    if(monsCore){
                        const monsCoreItem = {...monsCore, price: monsCore.secondPrice, meshId: makeRandNum(), qnty: 1}
                        
                        this.addToInventory(monsCoreItem).then(() => {
                            this.obtain(monsCoreItem.dn,1,false)
                        })
                        
                    }else log("this monster has no core")
    
                    if(theItem){ // if there is an item for this monster
                        if(Math.random() * 10 > 8.5) this.popItemInfo({...theItem, meshId: makeRandNum(), qnty: 1})
                    }
                    
                    // EDIBLE MONSTERS
                    let foodDet
                    switch(monster.monsName){
                        case "minotaur":
                            foodDet = { meshId: makeRandNum(), 
                                name: 'minMeatRaw', dn: "minotaur meat", itemType: 'food', 
                                price: 100, qnty: 1}
                                setTimeout(() => {
                                    this.addToInventory(foodDet).then(() => {
                                        this.obtain(foodDet.name,1,false)
                                    }) 
                                }, 600)                               
                        break;
                        case "rabbit":
                            foodDet = { meshId: makeRandNum(), 
                                name: 'rabbitMeatRaw', dn: "Rabbit meat", itemType: 'food', 
                                price: 40, qnty: 1}
                                setTimeout(() => {
                                    this.addToInventory(foodDet).then(() => {
                                        this.obtain(foodDet.dn,1,false)
                                    }) 
                                }, 600)                               
                        break;
                    }
                    this.readCheckMyQuest("slay", monster.monsName, monster.monsBreed)   
                })                     
            }  
        }
        
        // this.addToBash({_id: monster.monsId, mesh: monster.body, bashPower})
    }
    monsterDied(monsId){
        const theMons = Monsterz.find(mons => mons.monsId === monsId)
        if(!theMons) return log("cannot find the monster")
        theMons.enemyDetection.position.y = 100
        theMons.atkDetection.position.y = 100
        theMons.weapon.position.y = 100
        theMons.anims.forEach(anim => {
            if(anim.name === "death"){
                anim.play()
            }else{
                anim.stop()
            }
        })
        
        if(theMons.monsSoundDied !== undefined) theMons.monsSoundDied.play()
        theMons.nameMesh.dispose()
        Monsterz = Monsterz.filter(mons => mons.monsId !== theMons.monsId)
        theMons.robHealthGui.width = `0px`;
        setTimeout(() => {
            theMons.rootMesh?.getChildren().forEach(msz => {
                log(msz.name)
                msz.dispose()
            })       
            theMons.body.dispose()            
        }, 40000)
        this._scene.getMeshByName(`fakeShadow.${monsId}`)?.dispose()
    }
    monsterAttack(monsId, monsterName, monsBodyPos, targIdOfHero, animName){
        const theMonster = Monsterz.find(mons => mons.monsId === monsId)
        if(!theMonster) return log("this monster that attack is not found")

        const theMonsterTargMesh = this._scene.getMeshByName(`box.${targIdOfHero}`)
        if(!theMonsterTargMesh){
            theMonster.targHero = undefined
            theMonster.isChasing = false
            theMonster.isAttacking = false
            return log("the hero target is not found");
        }

        const targPos = theMonsterTargMesh.getAbsolutePosition();
  
        theMonster.body.position = new Vector3(monsBodyPos.x, monsBodyPos.y,monsBodyPos.z)
        
        this.playerLookAt(theMonster.body, {x: targPos.x, z: targPos.z});
        
        this.playAnim(theMonster.anims, animName)

        if(!theMonster.monsName.includes("slime")){
            theMonster.weapon.position.y = -3
        }
    }
    reduceDurability(theArmorItem, todeduct){
        log(theArmorItem.itemType)
        if(todeduct <=0 ) return
        switch(theArmorItem.itemType){
            case "armor":
                this.det.items.forEach(item => {
                    if(item.meshId === theArmorItem.meshId) {
                        item.cState-= todeduct
                        this.det.armor.cState-= todeduct
                    }
                    
                })
            break;
            case "sword":
                this.det.items.forEach(item => {
                    if(item.meshId === theArmorItem.meshId) {
                        item.cState-= todeduct
                        this.det.weapon.cState-= todeduct
                    }
                })
            break;
            case "helmet":
                this.det.items.forEach(item => {
                    if(item.meshId === theArmorItem.meshId) {
                        item.cState-= todeduct
                        this.det.helmet.cState-= todeduct
                    }
                    
                })
            break;
            case "gear":
                this.det.items.forEach(item => {
                    if(item.meshId === theArmorItem.meshId) {
                        item.cState-= todeduct
                        this.det.gear.cState-= todeduct
                    }
                    
                })
            break;
            case "shield":
                this.det.items.forEach(item => {
                    if(item.meshId === theArmorItem.meshId) {
                        item.cState-= todeduct
                        this.det.shield.cState-= todeduct
                    }
                })
            break;
        }
    }
    setNegativeStatUI(){
        negativeStatCont.innerHTML = ''
        // if(!this.det.status.length) return
        this.det.status.forEach(negstat => {
            const newDiv = createElement("div", `neg-stat ${negstat.effectType}`)
            const negStatImg = createElement("img", "ns-img")
            negStatImg.src = `./images/UI/${negstat.effectType}.png`
            const negStatcap = createElement("p", "ns-cap", negstat.effectType)
            switch(negstat.effectType){
                case "poisoned":
                    negStatcap.style.color = "#4b9863"
                break
                default:
                    negStatcap.style.color = "#f5f5f5"
                break
            }
            newDiv.append(negStatImg)
            newDiv.append(negStatcap)
            negativeStatCont.append(newDiv)
        })
    }
    async hitByNonMultiAI(body, enemBody, dmgTaken, animName, monsId, effects, isDemon, willNotLook){
        this.stopPress()
        closeGameUI()
        clearInterval(this.hitRecourceInterval);

        this.animStopAll(this.myChar, ["walk", "running", "0Idle", "hit"], true)
        if(this.myChar._casting){
            clearTimeout(this._skillReleaseTimeOut)
            this.createTextMesh(makeRandNum(), "cancelled","red",{x: 0, y: 0, z: 0}, 90, this._scene, true, this.myChar.bx)
            this.myChar._casting = false
            this.myChar.mode = this.myChar.prevMode
            this.allCanPress()
            if(this.socketAvailable){
                this.socket.emit("changeMode", {
                _id: this.det._id,
                mode: this.myChar.mode
                })
            }
        }

        let effectTimeOut
        let returnBtnSec = 300
        let myDef = this.det.stats.def*2;
        const {x,z} = enemBody.position
        !willNotLook && body.lookAt(new Vector3(x,body.position.y,z), 0,0,0)
        this.myChar.weaponCol.position.y = 9

        let deductInArmor = dmgTaken
        if(this.det.shield.name !== "none") {
            const myArmor = this.det.items.find(itm => itm.meshId === this.det.shield.meshId)
            if(!myArmor) return log("shield not found")
            if(myArmor.cState >= 1){
                myDef+= this.det.shield.plusDef
                this.det.items.forEach(itm => {
                    if(itm.meshId === this.det.shield.meshId){
                        this.reduceDurability(itm, deductInArmor/2)
                        deductInArmor = deductInArmor/2
                    }
                })
            }else{
                this.unEquip(myArmor)
                await this.deductItem(myArmor.meshId, 1)
                this._allSounds.brokenS.play()
                this._statPopUp(`Shield Broken`)
            }
        }
        if(this.det.armor.name !== "none") {
            const myArmor = this.det.items.find(itm => itm.meshId === this.det.armor.meshId)
            if(myArmor.cState >= 1){
                myDef+= this.det.armor.plusDef
                this.det.items.forEach(itm => {
                    if(itm.meshId === this.det.armor.meshId) this.reduceDurability(itm, deductInArmor/3)
                })
            }else{
                this.unEquip(myArmor)
                await this.deductItem(myArmor.meshId, 1)
                this._allSounds.brokenS.play()
                this._statPopUp(`Armor Broken`)
            }
        }
        if(this.det.gear.name !== "none") {
            const myArmor = this.det.items.find(itm => itm.meshId === this.det.gear.meshId)
            if(myArmor.cState >= 1){
                myDef+= this.det.gear.plusDef
           
                this.det.items.forEach(itm => {
                    if(itm.meshId === this.det.gear.meshId) this.reduceDurability(itm, deductInArmor/3)
                })
            }else{
                this.unEquip(myArmor)
                await this.deductItem(myArmor.meshId, 1)
                this._allSounds.brokenS.play()
                this._statPopUp(`Armor Broken`)
            }
        }
        if(this.det.helmet.name !== "none") {
            const myArmor = this.det.items.find(itm => itm.meshId === this.det.helmet.meshId)
            if(myArmor.cState >= 1){
                myDef+= this.det.helmet.plusDef
            
                this.det.items.forEach(itm => {
                    if(itm.meshId === this.det.helmet.meshId) this.reduceDurability(itm, deductInArmor/3)
                })
            }else{
                this.unEquip(myArmor)
                await this.deductItem(myArmor.meshId, 1)
                this._allSounds.brokenS.play()
                this._statPopUp(`helmet Broken`)
            }
        }

        let toDeduct = myDef >= dmgTaken ? .5 : dmgTaken - myDef
        // log('my def ' + myDef + " - dmgtaken " + dmgTaken)
        // log(`to deduct in my life ${toDeduct}`)

        clearTimeout(effectTimeOut)
        effectTimeOut = setTimeout(() => {
            if(this.det.hp <= 0) return log("dead after mons effect stop here")
            openGameUI()
            this.allCanPress()
        }, returnBtnSec)
        this.det.hp -= toDeduct
        if(effects && effects.chance > Math.random()*10){
            let willActivateEffect = true
            let theMons
            if(!isDemon){
                theMons = Monsterz.find(mons => mons.monsId === monsId)
            }else{
                theMons = demons.find(mons => mons._id === monsId)
            }
            if(!theMons) return log("monster or demon not found")
            if(theMons.effectS){ // only for sounds
                log(theMons.monsName + " has an effect Sound")
                theMons.effectS.setPlaybackRate(.9+Math.random()*.5)
                theMons.effectS.play()
            }   
            const statusAlreadyThere = this.det.status.some(status => status.effectType === effects.effectType)
            if(statusAlreadyThere && effects.effectType === "poisoned") willActivateEffect = false //means will not poison me again
            if(willActivateEffect){
                this.det.hp -= effects.plusDmg
                if(this.det.hp > 0){                    
                    let colorOfCap = "limegreen"
                    let theParticle
                    let textMeshName
                    switch(effects.effectType){
                        case "poisoned":
                            
                            if(!statusAlreadyThere) this.det.status.push({effectType: effects.effectType, dmgPm: effects.dmgPm});

                            textMeshName = effects.effectType
                            colorOfCap = "limegreen"
                            theParticle = this.createBloodParticle("poisonTex", 100, this.myChar.bx.position, "sphere", true, 5, true, false)
                            theParticle.color = new BABYLON.Color3(0.05, 0.18, 0.02)
                        break;
                        case "absorb":
                            switch (effects.absorbType) {
                                case "weapon":
                                    if(this.det.weapon.name !== "none"){
                                        textMeshName = `absorb +${this.det.weapon.plusDmg}`
                                        log(`monster before hp ${theMons.hp}+${this.det.weapon.plusDmg} max && ${theMons.maxHp}`)
                                        theMons.hp+=this.det.weapon.plusDmg
                                        theMons.maxHp+=this.det.weapon.plusDmg
                                        log(`monster AFTER hp ${theMons.hp} max && ${theMons.maxHp}`)
                                    }else{
                                        textMeshName = `absorb +${effects.defaultAbs}`
                                        theMons.hp+=effects.defaultAbs
                                        theMons.maxHp+=effects.defaultAbs
                                    }
                                    colorOfCap = "red"
                                break;
                                case "mp":
                                    const toAbsorb = Math.floor(effects.plusDmg/2)
                                    textMeshName = `absorb +${toAbsorb}`
                                    if(this.det.mp <= toAbsorb) this.det.mp = 0
                                    this.det.mp-=toAbsorb;

                                    theMons.hp+=toAbsorb
                                    theMons.maxHp+=toAbsorb
                                    colorOfCap = "blue"
                                break;
                            }                            
                            this.createBloodParticle("blood", 100, this.myChar.bx.position, "cone", true, 5, true, false)
                        break;
                    }
                    this.createTextMesh(makeRandNum(),textMeshName, colorOfCap, this.myChar.bx.position, 90,this._scene, true)
                    this.setNegativeStatUI()
            }
}
        }
        this.updateLifeManaSpGUI()
        this.updateLifeMesh(this.myChar, {hp: this.det.hp,maxHp:this.det.maxHp})
        if(this.myLoadingBarMin > 0){
            log("I am hit while there is loading ...")
            this.Treasures.forEach(tre => {
                if(tre.isOpening){
                    if(tre.openingBy === this.det._id){
                        log('One treasure will be reclosed')
                        tre.isOpening = false
                        tre.openingBy = undefined
                        this.socketAvailable && this.socket.emit('reclose-treasure', {meshId: tre.meshId})
                    }                    
                }
            })

            clearInterval(this.intervalUntilFull)
            this.myLoadingBarMin = 0
            log("is opening treasure stop it");           
            this.stopAnim(this.myChar.anims, 'willbow')
            this.myBar.barMesh.isVisible = false
            this.myBar.bar.width = `0px`
            this.allCanPress()
            this.myChar.mode = "fist"
            openGameUI()
            if(this.det.weapon.name !== "none") this.keepSword(this.myChar.rootSword, this.myChar.rootBone)
        }
        if(this.det.hp <= 0) return this.initMyDeath() 
        
        if(this.myChar._minning || this.myChar._training){
            log("I am minning or training")
            clearInterval(this.hitRecourceInterval)
            this.myChar._minning = false
            this.myChar._training = false
            // this.keepSword(this.myChar.rootSword, this.myChar.rootBone)
            this.myChar.mode = "weapon"
        }
        if(this.myChar._crafting){
            this._statPopUp("crafting cancelled", 100, "red")
            this.cancelCraft()
        }
        clearTimeout(this.timeOutToSave)
        this.timeOutToSave = setTimeout( async () => {
            await this.updateMyDetailsOL(this.det, false) // kase pag naka on to mag setdeatils siya kaya kung maraming aatake saken pagka bawas ng this det.hp ko at biglang inupdate ang this.det.hp ko bigla babalek yung buhay ko
        }, 2500)
    
        this.playAnim(this.myChar.anims, animName)
    }
    hitByHero(thePlayer, data){
        const theEnemy = players.find(pl => pl._id === data._id);
        if(!theEnemy) return log('the player who hit is not found')
        thePlayer._minning = false
        thePlayer._training =  false
        if(theEnemy.mode === "fist") thePlayer.punchedS.play();
        if(theEnemy.mode === "weapon") thePlayer.sliceHitS.play();
        thePlayer.bx.lookAt(new Vector3(data.dirTarg.x, this.yPos, data.dirTarg.z),0,0,0)
        thePlayer.bx.position = new Vector3(data.pos.x, this.yPos, data.pos.z)
        // this.addToBash({_id: data.targHero, mesh: thePlayer.bx, bashPower: data.bashPower})
        this.stopAnim(thePlayer.anims, 'willbow');
        this.recourceHits = 0 // for tree and ore
        clearInterval(this.hitRecourceInterval)
        if(!data.skillName){
            this.stopAnim(thePlayer.anims, 'willbow')
            this.playAnim(thePlayer.anims, 'hit')
        }
    }
    bump(player){
        player.mode = "none"
        this.animStopAll(player, ['walk', 'running'])
        player.bx.locallyTranslate(new Vector3(0,0,-.15))
        this.playAnim(player.anims, "bump");
        this.myChar.runningS.stop()
        setTimeout(() => player.mode = "fist", 1300)
        this.keepSword(player.rootSword, player.rootBone)
        if(player._id === this.det._id){
            this.flyingWeaponz = this.flyingWeaponz.filter(mesz => mesz.meshId !== player._id)
            this.stopPress();
            botMoving = false;
            moveNums = { straight: 0, leftRight: 0 }
            this.myChar._moving = false
            this._enableKeyPessTimeout = setTimeout(() => {
                this.allCanPress()
            }, 1500)
            this.setProperSound()
        }
        
    }
    resetPlusBuffs(){
        this.plusDmg = 0
        this.plusDef = 0
        this.plusCore = 0
        this.plusmagic = 0
    }
    claimReward(itemDetail, dura){
        setTimeout(async () => {
            await this.addToInventory({...itemDetail, qnty: 1, meshId: makeRandNum()})
            log(itemDetail)
            this.obtain(itemDetail.name, 1, false)
        }, dura)
    }
    async readCheckMyQuest(typeOfQuest, questTarg, breedOrRarity){
        switch(typeOfQuest){
            case "slay":
            this.det.quests.forEach(myqst => {
                if(myqst.questTarget.targetName === questTarg){
                    log("quest located")
                    if(myqst.questTarget.targetType === breedOrRarity){
                        if(myqst.isCleared) return log("quest is already cleared for this" + questTarg)
                        log("same name and same breed of enemy")
                        myqst.currentNumber++
                        if(myqst.currentNumber >= myqst.demandNumber){
                            myqst.isCleared = true
                            showNotif("Quest Reached Proceed To Guild", 2000)
                        }
                    }
                }
            })
            break;
            case "edibles":
                const theItemQuest = this.det.quests.find(myqst => myqst.questTarget.targetName === questTarg.name)
                if(!theItemQuest) return log("no quest with this");
                
                if(theItemQuest.isCleared) return log("quest is already cleared for this" + questTarg.name)
                
                theItemQuest.currentNumber = questTarg.qnty
                if(theItemQuest.currentNumber >= theItemQuest.demandNumber) theItemQuest.isCleared = true
            break;
        }
        await this.updateMyDetailsOL(this.det, true)
    }
    recalMeeleDmg(){
        let totalDmg = 0
        let physicDmg = (this.det.stats.core * this.physicalX) + this.plusCore
       
        switch(this.myChar.mode){
            case "weapon":
                if(!this.det.weapon) return log("no weapon")
                totalDmg = physicDmg + parseInt(this.det.weapon.plusDmg) + this.plusDmg + (this.det.stats.sword * this.weaponX)
    
                const minDurability = this.det.weapon.durability/3
                if(this.det.weapon.cState <= minDurability) totalDmg = totalDmg/2
            break;
            case "fist":
                
                totalDmg = physicDmg
            break
            case "noneweapon":
                
                if(!this.det.weapon) return log("no weapon")
                totalDmg = physicDmg + parseInt(this.det.weapon.plusDmg) + this.plusDmg + (this.det.stats.sword * this.weaponX)
                
            break;
        }
        if(this.det.survival.sleep <= 20){
            totalDmg = totalDmg/2
        }
        return totalDmg
    }
    recalMagicDmg(){
        let totalDmg = 0;
        let myMagDmg = (this.det.stats.magic * this.magX) + this.plusmagic
        totalDmg+=myMagDmg
        switch(this.myChar.mode){
            case "weapon":
                if(!this.det.weapon) return log("no weapon")
                let weapMagDmg = this.det.weapon.plusMag    
                const minDurability = this.det.weapon.durability/3
                if(this.det.weapon.cState <= minDurability && weapMagDmg) weapMagDmg = weapMagDmg/2
                totalDmg += parseInt(weapMagDmg ? weapMagDmg : 0)
                log("weapon plus Magic " + weapMagDmg)
            break;
        }
        if(this.det.survival.sleep <= 20){
            totalDmg = totalDmg/2
        }
        return totalDmg
    }
    recalPhyDefense(dmgTaken){
        let myDef = this.det.stats.def*1.5;

        if(this.det.armor.name !== "none") {
            myDef+= this.det.armor.plusDef
            this.reduceDurability(this.det.armor, dmgTaken/4)
        }
        if(this.det.gear.name !== "none") {
            myDef+= this.det.gear.plusDef
            this.reduceDurability(this.det.gear, dmgTaken/4)
        }
        if(this.det.helmet.name !== "none") {
            myDef+= this.det.helmet.plusDef
            this.reduceDurability(this.det.helmet, dmgTaken/4)
        }
        if(this.det.shield.name !== "none") {
            myDef+= this.det.shield.plusDef
            this.reduceDurability(this.det.shield, dmgTaken/4)
        }
        return myDef
    }
    regEnemyToAttack(){
        Monsterz.forEach(monster => {
            const alreadyHave = this.enemyRegistered.some(enemId => enemId === monster.monsId)
            if(alreadyHave) return log("this monster is already registered !")
            
            this.myChar.weaponCol.actionManager.registerAction(new ExecuteCodeAction(
                {
                    trigger: ActionManager.OnIntersectionEnterTrigger,
                    parameter: monster.body
                }, async e=>{
                    const themons = Monsterz.find(mons => mons.monsId === monster.monsId)
                                        
                    if(!themons) return log("monster not found")
                    let myTotalDmg = parseInt(this.recalMeeleDmg())
         
                    this.focusOn = monster.body

                    if(this.myChar.mode === "fist"){
                        this.myChar.punchedS.setPlaybackRate(.8 + Math.random()*.4)
                        this.myChar.punchedS.play()
                    }
    
                    let criticalMultiplier = 2
                    const mpos = monster.body.position
                    
                    const myposition = this.myChar.bx.position
                    let isCritical = false;
                    // 30% of chance to crit
                    let chanceOfCrit = 3
                    if(this.det.survival.sleep >= 20 && Math.random()*10 < chanceOfCrit) isCritical = true
                    if(isCritical){
                        const critMultiply = Math.floor(Math.random()*(criticalMultiplier+.5));
                        log('Crit multiplied to ' + critMultiply)
                        myTotalDmg = myTotalDmg + myTotalDmg*critMultiply
                    }else{
                        this.createTextMesh(makeRandNum(), myTotalDmg, "red", {x: mpos.x, y: mpos.y,z: mpos.z}, 80, this._scene, true, false)
                    }
                    if(!this.socketAvailable){
                        this.monsterIsHit(monster.monsId, {x: myposition.x, z: myposition.z}, this.myChar._id, myTotalDmg, {x:mpos.x, z:mpos.z}, this.myChar.mode, isCritical)
                        if(themons.hp <= 0) return log('monster is dead')
                    }else{
                        // babawasan niya yung buhay ng monster
                        this.socket.emit("monsterIsHit", {monsId: monster.monsId, dmgTaken: myTotalDmg, _id: this.det._id,
                        pos: {x: mpos.x, z: mpos.z}, mypos: {x: myposition.x, z: myposition.z}, mode: this.myChar.mode, isCritical })
                    }
                    // reduce or broke your item if it reaches 0 cState
                    if(this.det.weapon.name !== "none"){
                        const myWeaponDet = this.det.items.find(itm => itm.meshId === this.det.weapon.meshId)
                        if(myWeaponDet){
                            log("my sword durability got deducted")
                            this.reduceDurability(myWeaponDet, myTotalDmg/4)
                            log(`item cState ${myWeaponDet.cState}`)
                            if(myWeaponDet.cState <= 0){
                                this.det.weapon.meshId = "none"
                                this.det.weapon.name = "none"
                                this.hideAllSword(this.myChar.swordz)
                                this._allSounds.brokenS.play()
                                // this.det.items = this.det.items.filter(alitm => alitm.meshId !== itm.meshId)
                                await this.deductItem(myWeaponDet.meshId,1)
                                this._statPopUp("Item Broke", 100, "red")
                                this.keepSword(this.myChar.rootSword, this.myChar.rootBone)
                                this.setMode("fist", 0)
                                this.checkIfHaveWeapon();
                            }
                        }
                    }
                }
            ))
            this.toRegAction(this.myChar.detector, monster.body, () => this.focusOn = monster.body)
            this.toRegActionExit(this.myChar.detector, monster.body, () => this.focusOn = null)
            this.enemyRegistered.push(monster.monsId)
        })
        players.forEach(player => {
            if(player._id === this.det._id) return
            const alreadyHave = this.enemyRegistered.some(enemId => enemId === player._id)
            if(alreadyHave) return 
            this.myChar.weaponCol.actionManager.registerAction(new ExecuteCodeAction(
                {
                    trigger: ActionManager.OnIntersectionEnterTrigger,
                    parameter: player.bx
                }, e =>{
                    const thePlayer = players.find(pl => pl._id === player._id)
                    if(!thePlayer) return log('this player is no longer in players ')
                    if(!this.isPkMode) return log("not on PK mode")
                    const myTotalDmg = parseInt(this.recalMeeleDmg())
                    log("my total meelee dmg" + myTotalDmg)

                    this.focusOn = player.bx
                         
                    const enemPos = player.bx.position
                    const mypos = this.myChar.bx.position
                    // this.myChar.mode === "fist" && player.punchedS.play()
                    // this.myChar.mode === "weapon" && player.sliceHitS.play()
                    if(this.socketAvailable) this.socket.emit("playerIsHitByHero", {_id: this.det._id, dmgTaken: myTotalDmg, bashPower: this.midBash,
                    dirTarg: {x: mypos.x,z:mypos.z}, pos: {x: enemPos.x, z: enemPos.z}, targHero: player._id })
                }
            ))
            this.enemyRegistered.push(player._id)
        })
        demons.forEach(player => {
            
            const alreadyHave = this.enemyRegistered.some(enemId => enemId === player._id)
            if(alreadyHave) return 
            this.myChar.weaponCol.actionManager.registerAction(new ExecuteCodeAction(
                {
                    trigger: ActionManager.OnIntersectionEnterTrigger,
                    parameter: player.bx
                }, e =>{
                    const theDemon = demons.find(pl => pl._id === player._id)
                    if(!theDemon) return log('this demon is no longer in demons array ')
                    if(theDemon.hp <= 0 ) return log("demon life is 0 return")
                    let myTotalDmg = parseInt(this.recalMeeleDmg())
                    log("my total meelee dmg" + myTotalDmg)

                    this.focusOn = player.bx
                    const isCritical = Math.random() > .8
                    if(isCritical) myTotalDmg * Math.random()*3
                    const enemPos = player.bx.position
                    const mypos = this.myChar.bx.position
                    if(this.myChar.mode === "fist"){
                        this.myChar.punchedS.setPlaybackRate(.9 + Math.random()*.4)
                        this.myChar.punchedS.play()
                    }
                    
                    this.demonIsHit(theDemon._id, mypos, myTotalDmg, enemPos, this.myChar.mode, isCritical)
                }
            ))
            this.enemyRegistered.push(player._id)
        })    
    }
    addToBash(meshAndId){
        //meshandid = {_id, mesh,bashedPower}
        this.bashed.push(meshAndId)

        setTimeout(() => {
            this.removeToBash(meshAndId._id)
        }, 200)
    }
    removeToBash(theMeshId){
        this.bashed = this.bashed.filter(bashedPerson => bashedPerson._id !== theMeshId)
    }
    arcCam(scene){
        const cam = new ArcRotateCamera("arc", 0,0,7.5, new Vector3(0,0,0), scene)
        scene.activeCamera = cam
        cam.minZ = 0.01

        cam.attachControl(canvas, true)
        cam.checkCollisions = true

        cam.onCollide = m => {
            log('cam colliding with ' + m.name)
            
            // this.camZoomingIn = true
            // cam.alpha-=Math.PI/2
            // clearTimeout(this.hideMeshTimeOut)
            // this.hideMeshTimeOut = setTimeout(() => {
            //     // cam.lowerRadiusLimit = 5.6 ;
            //     // cam.upperRadiusLimit = 14.5//6.1
            //     this.camZoomingIn = false
            // }, 2000)
            // if(cam.radius > 1) cam.radius -= 2.10
            // this.camZoomingOut = false
            // clearTimeout(this.hideMeshTimeOut)
            // this.hideMeshTimeOut = setTimeout(() => {
            //     this.camZoomingOut = true
            // }, 2500)
            // if(m.name.includes("rock")){
            //     m.isVisible = false
            //     clearTimeout(this.hideMeshTimeOut)
            //     this.hideMeshTimeOut = setTimeout(() => {
            //         m.isVisible = true
            //     }, 500)
            // }
            if(m.name.includes("house") || m.name.includes("wall")){
                if(isLoading){
                    log("cam is stock while loading")
                    cam.alpha = Math.PI
                }
                cam.radius-=.5
                if(m.name.includes("house")){
                    m.isVisible = false
                    cam.lowerRadiusLimit = .5
                    clearTimeout(this.hideMeshTimeOut)
                    this.hideMeshTimeOut = setTimeout(() => {
                        m.isVisible = true
                        cam.lowerRadiusLimit = 4
                    }, 1000)
                }
            }
        }
        // cam.exit
        this.cam = cam
        return cam
    }
    camSetTarg(body, cam, alpha,beta){
        // camera.lowerBetaLimit = 0.01;
        // camera.upperBetaLimit = (1.4) * 0.99;
        // camera.lowerRadiusLimit = 8 ;
        // camera.upperRadiusLimit = 8//6.1
        cam.setTarget(body)
        cam.alpha = alpha
        cam.beta = beta
        cam.minZ = 0.01
        cam.angularSensibilityX = 1000
        cam.angularSensibilityY = 1000

        cam.lowerRadiusLimit = 5.5;
        cam.upperRadiusLimit = 14.5
        cam.lowerBetaLimit = .85;
        cam.upperBetaLimit = 1
        let isLowcam = false
        this.placeWithLowCam.forEach(pName => {            
            if(this.currentPlace && this.currentPlace.includes(pName)) isLowcam = true
        })
        if(isLowcam){
            cam.lowerRadiusLimit = 3.8;
            cam.upperRadiusLimit = 4.4
        }
    }
    resetMeshes(){
        theCharacterRoot = undefined
        cam = undefined
        shadowGen = undefined
        allsword = undefined
        wingRoot = undefined
        patsRoot = undefined
        light = undefined
        wholeTree = undefined
        allHouses = undefined
    }
    setUp(isSocketAvail){
        this.clearIntervals()
        this.enemyRegistered = [];
        this.closePopUpAction();

        Monsterz = [];
        players = [];
        demons = []
        bonFirezz = []

        this.blocks = [];
        this.socketAvailable = isSocketAvail
        this.targetRecource = undefined
        this.focusOn = null
        this._meeleAtk = "punch"

        this.scripts = []
        this.NPCs = []
        this.guards = []
        this.Trees = []
        this.Treasures = []
        this.AllFlowerz = []
        this.Ores = []
        this.Orbs = []
        this.Seedz = []
        this.lootz = []
        this.Crytalz = []
        this.allHitBox = []

        // MONSTERS THROWING
        this.likeRock
        this.likeSting
        this.hitBox = undefined

        // CRAFT RELATED
        this.canDropHere = true
        this.craftFunc = undefined
        this.toDropMesh = undefined

        this.setNegativeStatUI();
        this.setRightUIs([''], true)

        moveNums = { straight: 0, leftRight: 0 }
        displayElems([craftIcon], "block")
        let itemElementz = []
        document.querySelectorAll(".topick-bx").forEach(itmElem =>itemElementz.push(itmElem))
        if(itemElementz.length) displayElems(itemElementz, "block")
    }
    // icons shown down
    checkSkillModes(){
        skillCont.innerHTML = ''
        this.det.skills.forEach(skil => {
            log(skil.requireMode)
            if(skil.requireMode !== this.myChar.mode && skil.requireMode !== "any") return
            const skillBx = createElement("div", `skill-bx ${skil.name}`)
            const skillImg = createElement("img", "skill-img")
            skillImg.src = `./images/skills/${skil.name}.png`
            skillBx.append(skillImg)
            
            switch(skil.element){
                case "fire":
                    skillBx.style.border = "1px solid crimson"
                break
            }
            skillCont.append(skillBx)
        })
    }
    // icons shown down
    setMySkills(){
        skillCont.innerHTML = ''
        this.det.skills.forEach(skil => {
            const skillBx = createElement("div", `skill-bx ${skil.name}`)
            const skillImg = createElement("img", "skill-img")
            skillImg.src = `./images/skills/${skil.name}.png`
            skillBx.append(skillImg)
            
            switch(skil.element){
                case "fire":
                    skillBx.style.border = "1px solid crimson"
                break
            }
            skillCont.append(skillBx)
        })
        if(this.myChar) this.checkSkillModes()        
    }
    disablePointerPicks(scene){
        scene.pointerMovePredicate = () => false;
        scene.pointerDownPredicate = () => false;
        scene.pointerUpPredicate = () => false;
    }
    stillSpawning(cb){
        let runWaiting
        this.showLoadingScreen(false, 'wizard')
        this.stopMyCharacter()
        runWaiting = setInterval(() => {
            if(isSpawningLoading) return log('exit not yet finish loading')
            clearInterval(runWaiting)
            cb()
        }, 300)
    }
    clearIntervals(){ 
        clearInterval(this.hpRegenInterval)
        clearInterval(this.mpRegenInterval)
        clearInterval(this.spRegenInterval)

        clearInterval(this.hungerInterval)
        clearInterval(this.sleepyInterval)
        clearInterval(this.musicInterval)
        // if(simpleNpc.length && this.currentPlace === 'heartland'){
        //     simpleNpc.forEach(npz => clearInterval(npz.intervalWalking))
        // }
        magicCircleTimeOuts.forEach(timeOutz => {
            clearTimeout(timeOutz)
        })
    }
    updateHunger(){
        if(this.det.survival.hunger > 0) this.det.survival.hunger-=1
        this.updateSurvival_UI();
        const toDeduct = this.det.maxHp*.1 // 10% of life

        if(this.det.hp > toDeduct && this.det.survival.hunger < 1){
            this.det.hp -= toDeduct
            this._statPopUp(`- ${toDeduct}hp hunger`, 500, 'crimson');
            if(this.det.hp <= 0) return this.playerDeath(this.myChar)
        }
        if(this.det.survival.hunger < 13){
            this._allSounds.hungryS?.play()
            hungStat.parentElement.children[0].style.animation = "blinkingRed .5s infinite"
        }else{
            hungStat.parentElement.children[0].style.animation = "none"
        }
    }
    runLifeManaStaminaRegen(){
        this.clearIntervals()
        lifeManaStamCont.style.display = "block"
        // HP
        this.hpRegenInterval = setInterval( () => {
            if(this.det.hp <= 0) return this.clearIntervals()
            if(this.det.hp <= this.det.maxHp) this.det.hp += this.det.regens.hp
            if(this.det.hp > this.det.maxHp) this.det.hp = this.det.maxHp
            this.updateHP_UI()
            this.updateLifeMesh(this.myChar, {hp: this.det.hp,maxHp:this.det.maxHp})
        }, 700)
        // MANA
        this.mpRegenInterval = setInterval( () => {
            if(this.det.mp < this.det.maxMp) this.det.mp += this.det.regens.mana
            if(this.det.mp > this.det.maxMp) this.det.mp = this.det.maxMp
            this.updateMP_UI()
        }, 700)
        // STAMINA
        this.spRegenInterval = setInterval( () => {
            if(this.det.sp < this.det.maxSp) this.det.sp += this.det.regens.sp
            if(this.det.sp > this.det.maxSp) this.det.sp = this.det.maxSp
            this.updateSP_UI()
        }, 500)
        this.updateHunger()
        
        this.hungerInterval = setInterval(() => {
            this.updateHunger()
            // saling ketket lang tong check body
            this.checkBody()
        }, 40.5 * 1000)
        // I PUT THE STATS DEDCUTION HERE
        this.sleepyInterval = setInterval(() => {
            if(this.det.survival.sleep > 0) this.det.survival.sleep-=.2
            if(this.det.survival.sleep < 0.2) this.det.survival.sleep = 0
            this.updateSurvival_UI();
            if(this.det.survival.sleep < 10){
                restStat.parentElement.children[0].style.animation = "blinkingRed .5s infinite"
            }else{
                restStat.parentElement.children[0].style.animation = "none"
            }

            // FOR STATUS EFFECTS
            if(this.det.status.length){
                this.det.status.forEach(effect => {
                    switch(effect.effectType){
                        case "poisoned":
                            this.det.hp -= effect.dmgPm
                            this.createBloodParticle("poisonTex",300, this.myChar.bx.position, "sphere", true, 1, true, undefined)
                            this.createTextMesh(makeRandNum(), `poisoned ${effect.dmgPm}`, "green", this.myChar.bx.position, 90, this._scene, true, false)
                        break
                    }
                })
                if(this.det.hp <= 0) this.initMyDeath()
            }
        }, 5.2 * 1000)
        log("successfully made the life") 
    }
    updateHP_UI(){
        lifeBar.style.width = `${(this.det.hp/this.det.maxHp) * 100}%`
        lifeCap.innerHTML = `${Math.floor(this.det.hp)}/${this.det.maxHp}`
    }
    updateMP_UI(){
        manaBar.style.width = `${(this.det.mp/this.det.maxMp) * 100}%`
        manaCap.innerHTML = `${Math.floor(this.det.mp)}/${this.det.maxMp}`
    }
    updateSP_UI(){
        stamBar.style.width = `${(this.det.sp/this.det.maxSp) * 100}%`
        stamCap.innerHTML = `${this.det.sp}/${this.det.maxSp}`
    }
    updateSurvival_UI(){
        const {sleep, hunger} = this.det.survival
        hungStat.innerHTML = Math.floor(hunger)
        restStat.innerHTML = Math.floor(sleep)
    }
    updateLifeManaSpGUI(){
        this.updateHP_UI()
        this.updateMP_UI()
        this.updateSP_UI()
    }
    updateLifeMesh(player, data){
        // this is the mesh on the top of my head    
        if(!player) return log('still life mesh is not yet made')
        player.lifeGui.width = `${(parseInt(data.hp)/parseInt(data.maxHp) * 100) * 2}px`;
    }
    cannotBeClick(arrayOfElem){
        arrayOfElem.forEach(elem => {
            elem.style.pointerEvents = "none"
            elem.style.opacity = .5
        })
    }
    returnClick(arrayOfElem){
        arrayOfElem.forEach(elem => {
            elem.style.pointerEvents = "visible"
            elem.style.opacity = 1
        })
    }
    showQuestInfo(isMyQuest){
        rewardInfoCont.style.display = "flex"
        rewardInfoCont.classList.remove("transClose")
        if(rewardInfo.questTarget.targetType === "edibles"){
            rewardImg.src = `./images/loots/${rewardInfo.questTarget.targetName}.png`
        }else{
            rewardImg.src = `./images/questpics/${rewardInfo.questPicName}.png`
        }
        log(rewardInfo)
        rewardTtle.innerHTML = rewardInfo.title
        rewardDesc.innerHTML = isMyQuest ? `${rewardInfo.def} <br/> required: ${rewardInfo.currentNumber}/${rewardInfo.demandNumber}`: `${rewardInfo.def} <br/> required: ${rewardInfo.demandNumber}`
        const rankDN = ranks.find(rnk => rnk.rankDig === rewardInfo.requiredRank)
        if(!rankDN) return log("incorrent rankDig")
        rankFloat.innerHTML = rankDN.displayRank
        itemRewardsList.innerHTML = `reward `
        rewardInfo.reward.rewardItems.forEach(name => {
            const theItem = records.find(itm => itm.name === name)
            if(!theItem) return log("item not found")
            const newImg = createElement("img", "reward-img")
            newImg.src = `./images/loots/${theItem.name}.png`
            itemRewardsList.append(newImg)
        })
        coinReward.innerHTML = rewardInfo.reward.rewardCoin
    
        if(isMyQuest){
            acceptQuestBtn.style.display = "none"
            deleteQuestBtn.style.display = "block"
        }else{
            acceptQuestBtn.style.display = "block"
            deleteQuestBtn.style.display = "none"
        }
    }
    async delQuestFromMain(_questId){
        await this.useFetch(`${APIURL}/quests/delete/${_questId}`, "DELETE", this.token)
    }
    async setUpQuest(){
        const response = await fetch(`${APIURL}/quests`)
        this.quests = await response.json();
        questList.innerHTML = ''
        if(!this.quests.length) return questList.innerHTML = "<p class='not-available'>No Available Quest At The Moment</p>"
        this.quests.forEach(qst => {
            log(qst)
            const newDiv = createElement("div", `qst-bx ${qst.questId}`)
            const qstImg = createElement("img", `qst-target-img`);
            if(qst.questTarget.targetType === "edibles"){
                qstImg.src = `./images/loots/${qst.questTarget.targetName}.png`
            }else{
                qstImg.src = `./images/questpics/${qst.questPicName}.png`
            }
            const qttle = createElement("p", 'qst-ttle', qst.title)
            const theQrank = ranks.find(rnk => rnk.rankDig === qst.requiredRank)
            if(!theQrank) return log("rank not found")
            const reqRank = createElement("p", 'req-rank', theQrank.displayRank)
            
            const checkRewardBtn = createElement("button", `check-reward`, 'check reward');

            newDiv.append(qstImg)
            newDiv.append(qttle)
            newDiv.append(reqRank)
            newDiv.append(checkRewardBtn)
            questList.append(newDiv)

            checkRewardBtn.addEventListener("click", async () => {
                rewardInfo = qst
                this.showQuestInfo(false)
                log(rewardInfo)
            })
        })
    }
    async getCharacDetailsOnline(){
        loadingWhat = `retrieve data on server ...`
        const result = await this.useFetch(`${APIURL}/characters/${this.userId}`, "GET", this.token, false)
        myId = result._id
        return result
    }
    async updateLocOnline(dirTarg,mypos){
        const toEmit = {
            dirTarg: dirTarg,
            _id: this.det._id,
            mypos,
            mode: this.myChar.mode
        }
        this.socketAvailable && this.socket.emit("stop", toEmit)
        await this.useFetch(`${APIURL}/characters/updateloc/${this.det._id}`, "PATCH", this.token, mypos)
    }
    async saveMyCurrentLoc(){
        const {x,z} = this.myChar.bx.position
        const mypos = {x,z}
        const btfpos = this.btf.position
        const dirTarg = { x: btfpos.x, z: btfpos.z }

        const toEmit = {
            dirTarg: dirTarg,
            _id: this.det._id,
            mypos,
            mode: this.myChar.mode
        }
        this.socketAvailable && this.socket.emit("stop", toEmit)

        await this.useFetch(`${APIURL}/characters/updateloc/${this.det._id}`, "PATCH", this.token, mypos)
    }
    async updatePlace(placeName){
        const data = await this.useFetch(`${APIURL}/characters/updateplace/${this.det._id}`, "PATCH", this.token, {currentPlace: placeName})
        this.setDetails(data)
        log("place updated ! " + this.det.currentPlace)
        // this.det.places.forEach(place => log(place))
        // this.currentPlace = 'heartland'

        this.setProperSound()
        return data
    }
    playPlaceMusic(scene, placeName, intervalForMusic){
        clearInterval(this.musicInterval)
        switch(placeName){
            case "heartland":
                const heartLandS2 = new BABYLON.Sound("heartLandS2", "sounds/heartLandS2.mp3", scene,
                null, {volume: .1, spatialSound: false, autoplay: true, loop: false})
            break;
        }

        this.musicInterval = setInterval(() => {

        }, intervalForMusic)
    }
    _loadCharacterSounds(scene){

        const minoDeathS = new BABYLON.Sound("minoDeathS", "sounds/minoDeathS.mp3", scene,
        null, {spatialSound: true, maxDistance: 40, volume: .9})

        const goblinDeathS = new BABYLON.Sound("goblinDeathS", "sounds/goblinDeathS.mp3", scene,
        null, {spatialSound: true, maxDistance: 40, volume: .2})

        const openingScrollS = new BABYLON.Sound("openingScrollS", "sounds/openScrollS.mp3", scene,
        null, {spatialSound: false, volume: .9})

        const suspense1 = new BABYLON.Sound("suspense1", "sounds/suspens1.mp3", scene,
        null, {spatialSound: false, volume: .9})

        const suspense2 = new BABYLON.Sound("suspense2", "sounds/suspens2.mp3", scene,
        null, {spatialSound: false, volume: .9})

        const enemyEncounter = new BABYLON.Sound("enemyEncounter", "sounds/enemyEncounter.mp3", scene,
        null, {spatialSound: false, volume: 1})
        
        const hungryS = new BABYLON.Sound("hungryS", "sounds/hungryS.mp3", scene,
        null, {spatialSound: false, volume: 1})

        const eatSolidS = new BABYLON.Sound("eatSolidS", "sounds/eatSolidS.mp3", scene,
        null, {spatialSound: false, volume: 1})
        
        const normalDoorOC = new BABYLON.Sound("normalDoorOC", "sounds/normalDoorOC.mp3", scene,
        null, {spatialSound: false, volume: 1})

        const upgradeS = new BABYLON.Sound("upgradeS", "sounds/upgradeS.mp3", scene,
        null, {spatialSound: false, volume: 1})

        const enteredS = new BABYLON.Sound("enteredS", "sounds/enteredS.mp3", scene,
        null, {spatialSound: false, volume: 1})

        const enteringHoleS = new BABYLON.Sound("enteringHoleS", "sounds/enteringHoleS.mp3", scene,
        null, {spatialSound: false, volume: 1})

        const boxHitS = new BABYLON.Sound("boxHitS", "sounds/boxHitS.mp3", scene,
        null, {spatialSound: false, maxDistance: 60, volume: 1})

        const leapS = new BABYLON.Sound("leapS", "sounds/leapS.mp3", scene,
        null, {spatialSound: true, maxDistance: 60, volume: 1})

        const manaAbsorbS = new BABYLON.Sound("manaAbsorbS", "sounds/manaAbsorbS.mp3", scene,
        null, {spatialSound: true, maxDistance: 60, volume: 1})

        const brokenWoods = new BABYLON.Sound("brokenWoods", "sounds/brokenWoods.mp3", scene,
        null, {spatialSound: true, maxDistance: 60, volume: 1})

        const hitByFireS = new BABYLON.Sound("firehit", "sounds/firehit.mp3", scene,
        null, {spatialSound: true, maxDistance: 60, volume: 1})

        const houndBite = new BABYLON.Sound("houndBite", "sounds/houndBite.mp3", scene,
        null, {spatialSound: true, maxDistance: 60, volume: .8})

        const houndChaseS = new BABYLON.Sound("houndChaseS", "sounds/houndChaseS.mp3", scene,
        null, {volume: 1, spatialSound: true, maxDistance: 100, autoplay: false, loop: false})

        const superPunched = new BABYLON.Sound("superPunched", "sounds/superPunched.mp3", scene,
        null, {spatialSound: true, maxDistance: 60, volume: 1})

        const fireBall = new BABYLON.Sound("fireBall", "sounds/fireBall.mp3", scene,
        null, {spatialSound: true, maxDistance: 50, volume: .8})

        const poisonS = new BABYLON.Sound("poisonS", "sounds/poisonS.mp3", scene,
        null, {volume: .4, spatialSound: true, maxDistance: 40, autoplay: false, loop: false})
        poisonS.setPlaybackRate(1.1)

        const snakeBitS = new BABYLON.Sound("snakeBitS", "sounds/snakeBitS.mp3", scene,
        null, {volume: 1, spatialSound: true, maxDistance: 40, autoplay: false, loop: false})
        snakeBitS.setPlaybackRate(1)

        const snakeSound = new BABYLON.Sound("snakeSound", "sounds/snakeSound.mp3", scene,
        null, {volume: 1, spatialSound: true, maxDistance: 30, autoplay: false, loop: false})

        const beeS = new BABYLON.Sound("beeS", "sounds/beeS.mp3", scene,
        null, {volume: .2, spatialSound: true, maxDistance: 30, autoplay: false, loop: false})

        const whoop = new BABYLON.Sound("whoopSlash", "sounds/slashWhoosh.wav", scene,
        null, {volume: .2, spatialSound: true, maxDistance: 25, autoplay: false, loop: false})

        const brokenS = new BABYLON.Sound("brokenS", "sounds/brokenS.mp3", scene,
        null, {volume: .5, spatialSound: false, autoplay: false, loop: false})

        const merchantV = new BABYLON.Sound("brokenS", "sounds/merchantV.mp3", scene,
        null, {volume: .6, spatialSound: false, autoplay: false, loop: false})

        const normalV = new BABYLON.Sound("brokenS", "sounds/normalV.mp3", scene,
        null, {volume: .9, spatialSound: false, autoplay: false, loop: false})

        const woodFloorS = new BABYLON.Sound("woodFloorS", "sounds/woodRun.mp3", scene,
        null, {volume: .3, spatialSound: false, autoplay: false, loop: false})

        const rockSmashS = new BABYLON.Sound("rockSmashS", "sounds/rockSmashS.mp3", scene,
        null, {volume: 1, spatialSound: true, maxDistance: 25, autoplay: false, loop: false})

        const woodCuttingS = new BABYLON.Sound("woodcuttingS", "sounds/woodcuttingS.mp3", scene,
        null, {volume: .4, spatialSound: true, maxDistance: 25, autoplay: false, loop: false})

        const minning = new BABYLON.Sound("minning", "sounds/minning.wav", scene,
        null, {volume: .5, spatialSound: true, maxDistance: 25, autoplay: false, loop: false})

        const drawSword = new BABYLON.Sound("drawSword", "sounds/drawSword.mp3", scene,
        null, {volume: .7, spatialSound: true, maxDistance: 25, autoplay: false, loop: false})

        const sliceFlesh = new BABYLON.Sound("sliceFlesh", "sounds/sliceFlesh.wav", scene,
        null, {volume: .5, spatialSound: true, maxDistance: 25, autoplay: false, loop: false})

        const punched = new BABYLON.Sound("sliceFlesh", "sounds/punched.wav", scene,
        null, {volume: .5, spatialSound: true, maxDistance: 25, autoplay: false, loop: false})

        const itemEquipedS = new BABYLON.Sound("sliceFlesh", "sounds/itemEquipS.mp3", scene,
        null, {volume: .5, autoplay: false, loop: false})

        const characDeathS = new BABYLON.Sound("sliceFlesh", "sounds/characDeathS.mp3", scene,
        null, {volume: .5, autoplay: false, loop: false})

        const coinReceivedS = new BABYLON.Sound("sliceFlesh", "sounds/coinReceivedS.mp3", scene,
        null, {volume: .5, autoplay: false, loop: false})
        
        const daggerHitS = new BABYLON.Sound("sliceHit", "sounds/daggerHitS.mp3", scene,
        null, {volume: .5, spatialSound: true, maxDistance: 25, autoplay: false, loop: false})

        const sliceHit = new BABYLON.Sound("sliceHit", "sounds/sliceHit.mp3", scene,
        null, {volume: .5, spatialSound: true, maxDistance: 25, autoplay: false, loop: false})

        const openMagicCircS = new BABYLON.Sound("sliceHit", "sounds/openMagCircS.mp3", scene,
        null, {volume: .5, spatialSound: true, maxDistance: 25, autoplay: false, loop: false})

        const goblinHitS = new BABYLON.Sound("sliceHit", "sounds/goblinHitS.mp3", scene,
        null, {volume: .5, spatialSound: true, maxDistance: 25, autoplay: false, loop: false})
        goblinHitS.setPlaybackRate(1)

        const bonfireSound = new BABYLON.Sound("bonfireS", "sounds/bonfireS.mp3", scene,
        null, {volume: 1, spatialSound: true, maxDistance: 25, autoplay: false, loop: true})

        const woodCreakS = new BABYLON.Sound("woodCreakS", "sounds/woodCreakS.mp3", scene,
        null, {volume: .8, spatialSound: false, autoplay: false, loop: false})

        const consumeS = new BABYLON.Sound("consumeS", "sounds/consumeS.mp3", scene,
        null, {volume: .8, spatialSound: false, autoplay: false, loop: false})

        const skillAcquiredS = new BABYLON.Sound("skillAcquiredS", "sounds/skillAcquiredS.mp3", scene,
        null, {volume: .8, spatialSound: false, autoplay: false, loop: false})

        const nextBtnS = new BABYLON.Sound("sliceHit", "sounds/nextBtn.mp3", scene,
        null, {volume: 1, spatialSound: false, autoplay: false, loop: false})

        const changeModeS = new BABYLON.Sound("sliceHit", "sounds/changeModeS.mp3", scene,
        null, {volume: 1, spatialSound: false, autoplay: false, loop: false})

        const creepyAmbS = new BABYLON.Sound("creepyAmb", "sounds/creepyAmb.mp3", scene,
        null, {volume: .4, autoplay: isInTutorialMode ? true : false, loop: false})

        const celesMelody = new BABYLON.Sound("celesMelody", "sounds/celesMelody.mp3", scene,
        null, {volume: .4, autoplay: false, loop: false});

        const congratsS = new BABYLON.Sound("congratsS", "sounds/congratsS.mp3", scene,
        null, {volume: .5, autoplay: false, loop: false})

        const smallCongratsS = new BABYLON.Sound("smallCongratsS", "sounds/smallCongratsS.mp3", scene,
        null, {volume: .7, autoplay: false, loop: false})

        const running = new BABYLON.Sound("footstep", "sounds/running.wav", scene,
        null, {volume: .4, spatialSound: false, autoplay: false, loop: false})
        running.setPlaybackRate(1.2)

        const minotaurS = new BABYLON.Sound("footstep", "sounds/minotaurS.mp3", scene,
        null, {volume: .4, spatialSound: true, maxDistance: 30, autoplay: false, loop: false})

        const slimeDeathS = new BABYLON.Sound("footstep", "sounds/slimeDeathS.mp3", scene,
        null, {volume: .4, spatialSound: true, maxDistance: 30, autoplay: false, loop: false})

        const notifS = new BABYLON.Sound("footstep", "sounds/notifS.mp3", scene,
        null, {volume: .4, autoplay: false, loop: false})

        const spearStruckS = new BABYLON.Sound("footstep", "sounds/spearStruckS.mp3", scene,
        null, {volume: .8, spatialSound: true, maxDistance: 100, autoplay: false, loop: false})
        spearStruckS.setPlaybackRate(1.1) 

        const rephantasmS = new BABYLON.Sound("rephantasmS", "sounds/rephantasmS.mp3", scene,
        null, {volume: .8, spatialSound: true, maxDistance: 100, autoplay: false, loop: false})
        rephantasmS.setPlaybackRate(1.2) 

        this._allSounds = {
            openingScrollS,
            suspense1,
            suspense2,
            rephantasmS,
            hungryS,
            eatSolidS,
            manaAbsorbS,
            enemyEncounter,
            normalDoorOC,
            upgradeS,
            enteredS,
            enteringHoleS,
            leapS,
            brokenWoods,
            boxHitS,
            houndBite,
            houndChaseS,
            superPunched,
            hitByFireS,
            fireBall,
            beeS,
            poisonS,
            snakeBitS,
            snakeSound,
            merchantV,
            normalV,
            woodFloorS,
            smallCongratsS,
            brokenS,
            spearStruckS,
            notifS,
            characDeathS,
            itemEquipedS,
            coinReceivedS,
            daggerHitS,
            consumeS,
            skillAcquiredS,
            woodCreakS,
            nextBtnS,
            changeModeS,
            openMagicCircS,
            minotaurS,
            slimeDeathS,
            creepyAmbS,
            celesMelody,
            goblinHitS,
            whoop,
            sliceFlesh,
            sliceHit,
            punched,
            drawSword,
            running,
            minning,
            bonfireSound,
            woodCuttingS,
            rockSmashS,
            congratsS,
            minoDeathS,
            goblinDeathS,
        }
 
    }
    _loadDungeonSounds(scene){
        const demonSpeech = new BABYLON.Sound("demonSpeech", "sounds/demonSpeech.mp3", scene,
        null, {spatialSound: true, maxDistance: 160, volume: 1})

        const demonMockS = new BABYLON.Sound("demonMockS", "sounds/demonMockS.mp3", scene,
        null, {spatialSound: true, maxDistance: 60, volume: 1})

        const dyingDemonS = new BABYLON.Sound("dyingDemonS", "sounds/dyingDemonS.mp3", scene,
        null, {spatialSound: true, maxDistance: 60, volume: 1})

        this._allSounds = {...this._allSounds,
            demonSpeech,
            demonMockS,
            dyingDemonS,
        }
    }
    _loadTavernSounds(scene, bodyAttached){
        const burp = new BABYLON.Sound("burp", "sounds/burp.mp3", scene,
        null, {spatialSound: false, volume: .9})

        const ahhS = new BABYLON.Sound("ahhS", "sounds/ahhS.mp3", scene,
        null, {spatialSound: false, volume: .9})

        burp.attachToMesh(bodyAttached)
        ahhS.attachToMesh(bodyAttached)

        this._allSounds = {...this._allSounds,
            burp,
            ahhS,
        }
    }
    setProperSound(){
        switch(this.myChar.mode){
            case "stand":
                this.setWalkSound()
            break;
            case "none":
               this.setWalkSound()
            break;
            default:
               this.setRunningSound()
            break;
        }
        log("Our Current place is " + this.currentPlace)
        log("Set The Proper Sound for " + this.myChar.mode)
    }
    openStoryWritten(startWord, arrayOfWords, callBack){
        let intervalWritten
        let pageNum = startWord
        storyBoardCont.style.display = "flex";
        if(storyBoardCont.className.includes("screenFadeOff")) storyBoardCont.classList.remove("screenFadeOff")
        storyBoardCont.innerHTML = ''

        const newP = createElement("p", "story-word opening-closing", arrayOfWords[pageNum])
        storyBoardCont.append(newP)
        pageNum++
        intervalWritten = setInterval(() => {

            storyBoardCont.innerHTML = ''
            const theWordElem = createElement("p", "story-word opening-closing", arrayOfWords[pageNum])
            storyBoardCont.append(theWordElem)
            
            if(arrayOfWords.length <= pageNum){
                log('finished line')
                setTimeout(() => {
                    if(callBack) callBack()
                    storyBoardCont.classList.add("screenFadeOff");
                    setTimeout(() => storyBoardCont.style.display = "none", 1000)
                }, 4000)
                return clearInterval(intervalWritten)
            } 
            pageNum++
        }, 5000)
        
    }
    userJoinedInitOnce(){
        log("socket available will userJoinedINIT !")
        this.socket.on("userJoined", data => {
            if(!this.socketAvailable) return log("socket available is off")
            log("someone joined " + data.uzers.length)

            allUzers = data.uzers
            theOrez = data.orez
            theTreez = data.treez
            theSeedz = data.seedz
            theMonz = data.monz
            theTreasurez = data.treasurez
            theLootz = data.lootz
            theHouzes = data.housez
            theBonFirez = data.bonfires
            theFlowerz = data.flowerz
            theBedLeaves = data.bedleaves

            this.checkAll()
            plOnline.innerHTML = `players online: ${data.uzers.length}`

        })
        
        this.socket.on("deliver-reload", idFromTcp => {
            // means opening same account at the same time in different browsers
            if(this.det._id === idFromTcp) return window.location.reload()
        })
    }
    calibrateLoot(rarity){
        let coin = 0
        switch(rarity){
            case 1:
                coin += Math.random()*150
            break;
            case 2:
                coin += Math.random()*500
            break;
            default:
                coin += Math.random()*30
            break
        }
        this.det.coins += coin
        this.obtain(`coins `, Math.floor(coin))
        const lootsToGet = []
        log('loot rarity ' + rarity)
        records.forEach(rec => {
            if(rec.rarity === rarity && Math.random() > .98) lootsToGet.push(rec)
        })
        log('loots to get ', lootsToGet)
        lootsToGet.forEach( loot => {
            this.popItemInfo({...loot, meshId: makeRandNum(), qnty: 1, price: loot.secondPrice}, loot.dn)
        })
    }
    transformInto(scene, playerId, raceName, rootMesh, rHead, meshes, firstTime){
        let wingAnimas = []
        let figureMeshes = []
        if(firstTime){
            const thePL = players.find(pl => pl._id === playerId)
            if(!thePL) return log("players not found")
            const prevMode = thePL.mode
            thePL.mode = "none"
            this.playAnim(thePL.anims, "transform")
            setTimeout(() => thePL.mode = prevMode ? prevMode : "stand", 3000)
        }
        meshes.forEach(mesh => {
            if(mesh.name === "ear.elf"){             
                mesh.isVisible = false
                if(raceName === "elf") mesh.isVisible = true
            }
        })
        switch(raceName){
            case "demon":
                let wing = wingRoot.instantiateModelsToScene();
                wing.animationGroups.forEach(ani => {
                    ani.name = ani.name.split(" ")[2]
                    wingAnimas.push(ani)
                })
                wing.rootNodes[0].getChildren().forEach(mes => {
                    mes.name = mes.name.split(" ")[2]
                    if(mes.name !== "Armature") figureMeshes.push(mes);
                })
                wing.rootNodes[0].parent = rootMesh
                wing.rootNodes[0].position = new Vector3(0,1.6,0)
                wing.rootNodes[0].rotationQuaternion = null
                wing.animationGroups[0].play(true);

                allhelmets.forEach(helmt => {  
                    if(helmt.name === `horns.reddemon`){
                        const clonedHorn = helmt.clone(helmt.name)
                        clonedHorn.parent = rHead
                        clonedHorn.position = new Vector3(0,0,0);
                    }
                })
            break;
            case "elf":
                const rotatingMesh = this.btf.clone("rotatingMesh")
                const trnsMone = this.createTransparentSign(scene, "./images/blessings/elfSign.png", rotatingMesh, { x: 0,y: 2, z: -2.8}, {x: -Math.PI/2,y:0,z:0})
                const trnsMTwo = this.createTransparentSign(scene, "./images/blessings/elfSign.png", rotatingMesh, { x: 0,y: 2, z: 2.8}, {x: -Math.PI/2,y:0,z:0})
                rotatingMesh.parent = rootMesh
                this.allRotating.push({mesh: rotatingMesh, spd: .05})
                this.createParticle("flare", 50, {x: 0,y: -3,z:0}, .05, { min: 1, max: 2.5}, .03,.08, 0, "sphere", true, rotatingMesh, rgbColors[0].rgb)
            break;
            case "divine":
                const patMeshId = makeRandNum()
                const patClone = patsRoot.clone(`pats.${patMeshId}`)
                patClone.parent = rootMesh;
                patClone.rotationQuaternion = null
                patClone.position = new Vector3(0,.8,-1.9);

                const pathMat = new StandardMaterial("patsmat")
                const matC = rgbColors[2].rgb
                pathMat.emissiveColor = new Color3(matC.r,matC.g,matC.b)
                patClone.material = pathMat
                setTimeout( () => {
                    this.createParticle("flare", 20, this.getMyPos(patClone,-2), .05, { min: 1, max: 1.5}, .03,.08, .5, "sphere", true, patClone, rgbColors[2].rgb)
                    this._allSounds.openMagicCircS.attachToMesh(rHead)
                    this._allSounds.openMagicCircS.play()
                    this.allRotating.push({mesh: patClone, spd: .2, isForward: true})
                    setTimeout(() => {                        
                        this.allRotating = this.allRotating.filter(msh => msh.mesh.name !== patClone.name);
                    }, 700)
                }, 10000)
            break;
        }
        return { wingAnimas, figureMeshes }
    }
    checkIfHaveWeapon(){
        if(this.det.weapon.name !== "none") {
            if(this.det.weapon.name.toLowerCase().includes("spear")){
                log("mode is weapon so show the throw spear")
                swordPicBtn.style.display = "block"
                throwBtn.style.display = "block"
                throwBtn.src = `./images/loots/${this.det.weapon.name}.png`
            }else{
                swordPicBtn.style.display = "block"
                throwBtn.style.display = "none"
            }
            swordPicBtn.src = `./images/loots/${this.det.weapon.name}.png`
            return swordPicBtn.style.display = "block"
        }
        log("wea have no weapon this.det.weapon is none ")
        swordPicBtn.style.display = "none"
        throwBtn.style.display = "none"
        
    }
    checkAll(){
        if(isLoading) return log("still loading")
        if(!this.socketAvailable) return log("socket not available here")
        log("will check all")
        this.checkOrez()
        this.checkTreez()
        this.checkPlayers();        
        this.checkHouzes()
        this.checkMonsterz()
        this.checkSeedz()
        this.checkBonFirez()
        this.checkBedLeaves()
        this.checkTreasurez()
        this.checkFlowers()
        this.checkLootz()
    }
    weJoinTheServer(dirT){
        this.socket.emit("join", {...this.det,
            _moving: false,
            _attacking: false,
            _minning: false,
            _training: false,
            _crafting: false,
            mode: "stand",
            dirTarg: {x: dirT.x, z: dirT.z}
        })
    }
    async main(){
        const result = await this.getCharacDetailsOnline()    
        if(result === "notfound"){
            await this._setUpCharacter()
        }else if(result.owner === this.userId){
            this.socket = io(webSocketURL)
            this.setDetails(result)
            this.setEventListeners()
            openGameUI(result)
            isLoading = true
            this.userJoinedInitOnce()

            log("going to " + this.det.currentPlace)
            switch(this.det.currentPlace){
                case "swampforest":
                    await this._swampForest()
                break;
                case "heartland":
                    await this._heartLand()
                break;
                case "guildhouse":
                    await this._goToGuildHouse() 
                break
                case "hiddenland":
                    await this._hiddenLand() 
                break
                case "crafthouse":
                    await this._goToCraftHouse() 
                break
                case "hl_club":
                    await this._hl_club()
                break;
            }
            if(this.det.currentPlace.includes('dungeon')){
                const dFloor = this.det.currentPlace.split(".")[1]
                await this._dungeon('Normal', dFloor,true)
            }
            if(this.det.currentPlace.includes('apartment')){
                await this._goToRoom(this.det.currentPlace)
            }
            
            this.activateSockets(allsword, seedMesh, treasure);
        }else {return this.noInternet()}

        this._engine.runRenderLoop(() => {
            this._scene.render()            
            divFps.innerHTML = this._engine.getFps().toFixed() + " fps";
        })
        
        window.addEventListener("resize",  () => {
            this._engine.resize();
            checkScreen()
        })
    }
    async _setUpCharacter(){
        showLoadingScreen(false, 'wizard', 520)
        doneSetup.addEventListener("click", e => {
            e.target.style.display = "none"
            enterNameCont.style.display = "flex"
        })
        setupCont.style.display = "flex"
        let clothes = []
        let hairs = []
        let pants = []
        let boots = []

        const scene = new Scene(this._engine)
          
        const cam = new ArcRotateCamera("arcCam", Math.PI/2, -1, 5, new Vector3(0,0,0), scene)
        cam.setTarget(new Vector3(0,1,0))

        cam.attachControl(canvas, true)

        hemLight = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 1, 0), scene);
        hemLight.intensity = .4
        light = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(-.1, -1, -.2), scene);
        light.intensity = .8

        shadowGen = new ShadowGenerator(1048, light)
        await this.createDungeonTiles(scene)
        
        const Cliff = await this.importMesh(scene, "./models/", "cliffs.glb")
        Cliff.meshes[1].parent = null
        Cliff.meshes[1].position = new Vector3(0,0,0)
        Cliff.meshes[0] = null

        // await this.createInstances("grass2",500, -20, 60, scene)
        const hairMat = new BABYLON.StandardMaterial('hairmat', scene)
        const Character = await SceneLoader.ImportMeshAsync("", "./models/", "gameCharac.glb");
        Character.meshes.forEach(mesh => {
            if(mesh.name.includes("elf")) mesh.dispose()
            if(mesh.name.includes("cloth")) {
                if(mesh.name.includes("demon")) return mesh.dispose()
                loadedMesh++
                clothes.push(mesh.name.split(".")[1])
                mesh.name.includes("capkelvins") ? mesh.isVisible = true : mesh.isVisible = false
            }
            if(mesh.name.includes("hair")){
                loadedMesh++
                hairs.push(mesh.name.split(".")[1])
                mesh.name.includes("aegon") ? mesh.isVisible = true : mesh.isVisible = false
            } 
            if(mesh.name.includes("pants")){
                loadedMesh++
                pants.push(mesh.name.split(".")[1])
                mesh.name.includes("brown") ? mesh.isVisible = true : mesh.isVisible = false
            } 
            if(mesh.name.includes("boots")){
                loadedMesh++
                boots.push(mesh.name.split(".")[1])
                mesh.name.includes("classic") ? mesh.isVisible = true : mesh.isVisible = false
            } 
            shadowGen.addShadowCaster(mesh)
            if(mesh.name.includes("armor")) mesh.dispose()
            if(mesh.name.includes("gear")) mesh.dispose()
            // light.excludedMeshes.push(mesh)
        })

        let categoryName = "hair"
        const getAptitudes = () => {
            let myApptitudes = []
            
            allElements.forEach(elemz => {
                if(Math.random() > .2) myApptitudes.push(elemz)
            })
            if(!myApptitudes.length) myApptitudes.push({
                name:'dark',
                advantage: "damage",
                plusDmg: 40,
                plusMag: 3,
                plusDef: 3,
                increase: 30
            })

            return myApptitudes
        }
        let toSave = {
            owner: this.userId,
            name: "",
            stats: {sword: 1, def: 1, core: 1, magic: 1},
            weapon: { meshId: makeRandNum(), name: "none", itemType: "sword", plusDef: 1, plusDmg: 1, 
            magRes: 0, plusMag: 0, price: 0},
            helmet: { meshId: makeRandNum(), name: "none", itemType: "helmet", plusDef: 1, plusDmg: 1, 
            magRes: 0, plusMag: 0, price: 0},
            shield: { meshId: makeRandNum(), name: "none", itemType: "shield", plusDef: 1, plusDmg: 1, 
            magRes: 0, plusMag: 0, price: 0},
            cloth: 'capkelvins',
            pants: 'brown',
            hair: 'aegon',
            boots: 'classic',
            hairColor: {r: 1, g: 1, b: 1},
            armor:{ meshId: makeRandNum(), name: "none", itemType: "armor", plusDef: 0, plusDmg: 0, 
            magRes: 0, plusMag: 0, price: 0},
            gear:{ meshId: makeRandNum(), name: "none", itemType: "gear", plusDef: 0, plusDmg: 0, 
            magRes: 0, plusMag: 0, price: 0},
            items: [],
            titles: ['newbie'],
            clearedQuests: 0,
            currentPlace: 'apartment.1',
            regens: {sp: 1, hp: .3, mana: .3}, // buy books to increase
            z: -30,
            aptitude: getAptitudes(),
            storyQue: ['wakingUp', 'numberOneTalk', 'firstFriend',"firstItem", 'numberTwoTalk'],
            mainObj: { name: "", dn: ""},
            skills: [],
            race: "human"
        }
        // GUI
        var hairColorTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        var panel = new GUI.StackPanel();
        panel.width = "200px";
        panel.isVertical = true;
        panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        panel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        hairColorTexture.addControl(panel);

        var textBlock = new GUI.TextBlock();
        textBlock.text = "Hair Color";
        textBlock.color = 'white'
        textBlock.height = "30px";
        panel.addControl(textBlock);     

        var picker = new GUI.ColorPicker();
        picker.value = hairMat.diffuseColor;
        picker.height = "150px";
        picker.width = "150px";
        picker.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;

        picker.onValueChangedObservable.add(function(value) { // value is a color3
            hairMat.diffuseColor.copyFrom(value);
            hairMat.specularColor = new BABYLON.Color3(0,0,0)
            const {r,g,b} = picker.value
            toSave = {...toSave, hairColor: {r,g,b}}
        });

        panel.addControl(picker);  
        
        panel.isVisible = false
        
        cam.minZ = .01
        this.camSetTarg(Character.meshes[0], cam, 3,4.0)        
        cam.upperRadiusLimit = 3;

        let theList
        category.addEventListener("click", e => {
            
            const categName = e.target.className.split(" ")[1]
            if(!categName) return
            log(categoryName)
            categoryName = categName
            
            choicesLabel.innerHTML = `Choose ${categName}`
            choicesList.innerHTML = ''
            panel.isVisible = false
            switch(categName){
                case "hair":
                    theList = hairs;
                    hairMat.specularColor = new BABYLON.Color3(0,0,0) 
                    Character.meshes.forEach(mesh => {
                        if(mesh.name.includes("hair")) mesh.material = hairMat
                    })                    
                    panel.isVisible = true
                break;
                case "cloth":
                    theList = clothes
                break;
                case "pants":
                    theList = pants
                break;
                case "boots":
                    theList = boots
                break;
            }
            theList.forEach(choice => {
                const newButton = document.createElement("button")
                newButton.className = 'li-choice'
                newButton.innerHTML = choice

                choicesList.append(newButton)
            })
            
        })
        choicesList.addEventListener("click", e => {
            const choice = e.target.innerHTML.toString()
            if(choice.includes("<") || choice.includes(" ")) return
            log(`${categoryName}.${choice}`)
            
            Character.meshes.forEach(mesh => {
                if(mesh.name.includes(categoryName)) {
                    if(mesh.name.includes(choice)){
                        log(choice)
                        mesh.isVisible = true
                        const newData = {...toSave, [categoryName]: choice}
                        toSave = newData
                        log(toSave)
                    }else{
                        mesh.isVisible = false
                    }
                }
                
            })
        })
        await scene.whenReadyAsync()
        this._scene.dispose()
        this._scene = scene
        hideLScreen()
        removeHomePage()
        this._loadCharacterSounds(scene)
        createAndStart.addEventListener("click", async () => { 
            
            if(nameInput.value.length < 1) return alert("Enter Character Name")
            loadingBtn(createAndStart)
            nameInput.style.display = "none"
            toSave = {...toSave, name: nameInput.value}
            const data = await this.useFetch(`${APIURL}/characters/save`, 'POST', this.token, toSave)
            if(!data) return openPopUp(`Server Error`)
            if(data === 'exist'){
                nameInput.style.display = "block"
                backToNormalBtn(createAndStart, "create")
                return alert("Name already registered")
            } 
            setupCont.style.display = "none"
            showLoadingScreen(false, 'wizard', 310)
            
            this.socket = io(webSocketURL)
            this.setDetails(data)
            this.setEventListeners()
            
            isLoading = true
            
            this.prevPlace = "apartment.1"
            
            if(!localStorage.getItem("db-intro-finish")) this.openStoryWritten(0,['Have You ever been in <br /> Another World', "A World Different From Yours"], () => {
                closeGameUI()
            })
            await this._goToRoom(`apartment.0`);
            this.activateSockets(allsword, seedMesh, treasure);
        })
        cam.setTarget(new Vector3(0,1,0))
        cam.alpha = 3.8
        cam.beta = 1.15
        cam.radius = 3        
    }
    async _swampForest(){
       
        worldChatCont.style.display = "flex"
        const maxLoad = 2020
        showLoadingScreen(false, 'wizard', maxLoad)
        this.setUp(true);loadedMesh++

        const result = await this.getCharacDetailsOnline()
        this.setDetails(result) ; loadedMesh++
        this.setHTMLUI(this.det)
        const scene = new Scene(this._engine);

        scene.actionManager = new ActionManager(scene);
        this.activateGlow(1.5, scene)
        this.creationOfFakeShadow(scene)
        light = new DirectionalLight("dirLight", new Vector3(0, -1, -0.3), scene);
        light.intensity = 0

        pointLight = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(0, 1,0), new BABYLON.Vector3(0, -1, 0), Math.PI+1, 2, scene);
        hemLight = new HemisphericLight("light", new Vector3(0,10,2), scene)
        hemLight.intensity = 1

        shadowGen = new ShadowGenerator(1024, light);
        await this.createMugRoot(scene)
        scene.ambientColor = Color3.FromInts(10, 30, 10);
        scene.clearColor = Color3.FromInts(127, 165, 13);

        this._loadCharacterSounds(scene)

        const cam = this.arcCam(scene)

        this.createBlock(100,180,{x: 0, z: -83}, 0, scene);
        this.createBlock(100,65,{x: 36, z: 77}, 0, scene);
        this.createBlock(100,55,{x: -50, z: 77}, 0, scene);
        // this.createBlock(100,24,{x: -15, z: 83}, -1.1, scene);
        this.createBlock(100,190,{x: -81, z: 0}, Math.PI/2, scene);
        this.createBlock(100,190,{x: 81, z: 0}, Math.PI/2, scene);

        // sound
        new BABYLON.Sound("swampforestSound", "sounds/swampforestS.mp3", scene,
        null, {volume: .3, autoplay: true, loop: true})

        // update naten muna ang loc naten para di magkagulo sa socketio
        // this.createFog(scene, 0.002)

        this.createGround(scene, "./images/modeltex/swampFTex.jpg",200)
        this.createSwmpTile(scene)

        const Cliff = await this.importMesh(scene, "./models/", "cliffs.glb")
        Cliff.meshes[1].parent = null
        Cliff.meshes[1].position = new Vector3(-110.9,0,20)
        Cliff.meshes[0] = null; 

        await this.outGateC(scene, {x:8,y:0,z:-85.7})

        const Tile = await this.importMesh(scene, "./models/", "tile.glb");
        this.createSwampDungeonWall(Tile, scene);

        const dungeonGate = await this.importMesh(scene, "./models/", "dungeonGate.glb");
        dungeonGate.meshes[0].position = new Vector3(0,0,-13);this.blocks.push(dungeonGate.meshes[1])

        await this.createNecessary(scene)
        await this.createWoodPlank();
        this.createDangerSign(scene, {x: -3, y:.6, z: 75}, {x: 0,z:0});
        await this.forestCreations(scene)

        theCharacterRoot = await BABYLON.SceneLoader.LoadAssetContainerAsync("./models/", "gameCharac.glb", scene)
        
        goblinRoot = await BABYLON.SceneLoader.LoadAssetContainerAsync("./models/mons/", "goblinGreen.glb", scene)
        minotaurRoot = await BABYLON.SceneLoader.LoadAssetContainerAsync("./models/mons/", "minotaur.glb", scene)
        rabbit = await BABYLON.SceneLoader.LoadAssetContainerAsync("./models/mons/", "rabbit.glb", scene)
        snakeRoot = await BABYLON.SceneLoader.LoadAssetContainerAsync("./models/mons/", "snake.glb", scene)
        golemRoot = await BABYLON.SceneLoader.LoadAssetContainerAsync("./models/mons/", "golem.glb", scene)
        monoloth = await BABYLON.SceneLoader.LoadAssetContainerAsync("./models/mons/", "monoloth.glb", scene)

        // box to follow
        const btf = this.createBoxToFollow(scene)
        this.myChar = this.createCharacter(this.det, theCharacterRoot, scene, shadowGen, false,true, allsword, allhelmets, allshields, light, 1.7)
        myCharDet = this.myChar; 
        
        if(this.prevPlace === 'heartland') this.myChar.bx.position = new Vector3(0,this.yPos,-70)
        npcInfos.forEach(npz => this.createNpc(theCharacterRoot, npz, true, btf))

        await this.createMerchant(scene, {x: -17,y:0,z:-22}, {x:4,z:-60})

        // CLIFFS 
        this.createClone(Cliff.meshes[1], 'cliff', {x:96.10,y:0,z:-60.79}, 0, scene)
        this.createClone(Cliff.meshes[1], 'cliff', {x:96.10,y:0,z:0.79}, 0, scene)
        this.createClone(Cliff.meshes[1], 'cliff', {x:96.10,y:0,z:55}, 0, scene)

        this.createClone(Cliff.meshes[1], 'cliff', {x:-96.10,y:0,z:-60.79}, 0, scene)
        this.createClone(Cliff.meshes[1], 'cliff', {x:-96.10,y:0,z:0.79}, 0, scene)
        this.createClone(Cliff.meshes[1], 'cliff', {x:-96.10,y:0,z:55}, 0, scene)

        this.createClone(Cliff.meshes[1], 'cliff', {x:67,y:0,z:92}, -Math.PI/2, scene)
        const leftClifClone = this.createClone(Cliff.meshes[1], 'cliff', {x:35,y:0,z:92}, -Math.PI/2, scene)
        const rightClifClone = this.createClone(Cliff.meshes[1], 'cliff', {x:-50,y:0,z:92}, -Math.PI/2, scene)
        this.blocks.push(leftClifClone)
        this.blocks.push(rightClifClone)
        this.createClone(Cliff.meshes[1], 'cliff', {x:67,y:0,z:-95}, -Math.PI/2, scene)
        this.createClone(Cliff.meshes[1], 'cliff', {x:6,y:0,z:-110}, -Math.PI/2, scene)
        this.createClone(Cliff.meshes[1], 'cliff', {x:-50,y:0,z:-95}, -Math.PI/2, scene)

        const Iron = await this.importMesh(scene, "./models/", "iron.glb")
        Iron.meshes[1].parent = null
        Iron.meshes[1].position = new Vector3(2,0,0)
        Iron.meshes[0] = null
        ironMesh = Iron.meshes[1];

        const Seed = await this.importMesh(scene, "./models/", "seed.glb")
        Seed.meshes[1].parent = null
        Seed.meshes[1].position = new Vector3(0,0,0)
        seedMesh = Seed.meshes[1]

        const Block = await this.importMesh(scene, "./models/", "block.glb")
        Block.meshes[1].parent = null

        this.runLifeManaStaminaRegen()
        this.camSetTarg(this.myChar.camTarg, cam, -Math.PI/2, 5);
        
        await this.createIns("tingrass.glb",{x:-63, y: -.1, z:0}, 900, {xmin: -15, xmax: 15}, {zmin: -73, zmax: 73}, {miny: -.3, maxy: .2})
        await this.createIns("tingrass.glb",{x:63, y: -.1, z:0}, 900, {xmin: -15, xmax: 15}, {zmin: -73, zmax: 73}, {miny: -.3, maxy: .2})
        await this.createIns("tingrass.glb",{x:1, y: -.1, z:57}, 500, {xmin: -75, xmax: 75}, {zmin: -13, zmax: 13}, {miny: -.2, maxy: .2})
        
        await this.createInstances("grass2",1200, -70, 70, scene);
        await this.createPeeble("./images/modeltex/rockTexBrown.png", scene, 50, {xmin: -70, xmax: 70}, {zmin: -70, zmax: 70})

        await scene.whenReadyAsync()
        this._scene.dispose()
        this._scene = scene
        
        this.createGolemRock(scene)
        this.createBeeSting(scene)

        this.arrangeCam(-1.4, 1.15)

        removeHomePage()
        loadedMesh = maxLoad
        openGameUI(this.det)
        
        this.showMapName('Swamp Forest', 3800);
        this.allCanPress()
        this.initPressControllers(scene)

        this.weJoinTheServer({x:0,z:0})
        
        if(this.prevPlace?.includes('dungeon')){ // dapat mauuna ang createCharacter mo dito kase nag aupdate din ng loc yun
            log("the prev place is dungeon")
            const randomX = -5 * Math.random()
            // this.arrangeMesh(this.myChar.bx.position, {x: randomX, y: this.yPos, z:-27}, {x:0, z: -30})
            this.myChar.bx.position = new Vector3(randomX, this.yPos, -27)
            this.arrangeCam(-1.4, 1.15)
            await this.updateLocOnline({x: 0, z:-30}, {x: randomX, z: -27})
            log(this.myChar.bx.position)
        }
        if(this.prevPlace === "hiddenland"){
            log("the prev place is Hidden LAnd")
            
            this.myChar.bx.position = new Vector3(-8, this.yPos, 80)
            this.arrangeCam(-1.4, 1.15)
            await this.updateLocOnline({x: -8, z:50}, {x: -8, z: 85})
        }
        // PATH TO DUNGEON
        const path = this.createPath(8,  {x: 0, z:-10.7}, scene)
        this.toRegAction(path, this.myChar.bx, async () => {
            this._allSounds.enteringHoleS.play()
            this.prevPlace = 'swampforest'
            this.stopPress(true)
            displayElems([apartInfos], "none")
            displayElems([aprtLoadingBx, apartCont], "flex")
            aprtLoadLabel.innerHTML = "Entering Dungeon..."
            this.socket.emit("dispose", {_id:this.det._id, place: this.currentPlace});
                   
            await this._dungeon('Normal', 1)
        })
        // PATH TO HEART LAND
        const pathToHland = this.createPath(4, {x: 8, z: -84}, scene);
        this.toRegAction(pathToHland, this.myChar.bx, async () => {
            this.stopPress(true)
            this.prevPlace = 'swampforest'
            this.setUp(true)
            displayElems([apartInfos], "none")
            displayElems([aprtLoadingBx, apartCont], "flex")
            aprtLoadLabel.innerHTML = "Outside..."
            this.socket.emit("dispose", {_id:this.det._id, place: this.currentPlace})
            
            await this.updatePlace('heartland')
            showLoadingScreen(false, 'wizard')
            this.resetMeshes()
            await this._heartLand()
        })
        // PATH TO HIDDEN LAND
        const pathToHidden = this.createPath(6, {x: -6.8, z: 87}, scene);
        this.toRegAction(pathToHidden, this.myChar.bx, async () => {
            this.stopPress(true)
            this.prevPlace = 'swampforest'
            this.setUp(true)
            displayElems([apartInfos], "none")
            displayElems([aprtLoadingBx, apartCont], "flex")
            aprtLoadLabel.innerHTML = "Outside..."
            this.socket.emit("dispose", {_id:this.det._id, place: this.currentPlace})
            
            await this.updatePlace('hiddenland')
            showLoadingScreen(false, 'wizard')
            this.resetMeshes()
            await this._hiddenLand()
        })
        hideLScreen();
        this.saveMyCurrentLoc();

        const renderThis = () => {
            this.actionAndMovement(this.btf)
            this.renderMonsters()
        }
        scene.registerBeforeRender(renderThis)
        if(this.myChar.bx.position.z === 0){
            this.myChar.bx.position = new Vector3(0,this.yPos, -30)
            this.saveMyCurrentLoc();
        } 
        window.innerHeight < 650 && this._makeJoyStick(this.socket, cam,scene, true)
        this.registerBlocks(this.myChar, .1);

        Tile.meshes.forEach(mesh => mesh.setEnabled(false))
        this.checkAll()
    }
    async _hiddenLand(){
       
        worldChatCont.style.display = "flex"
        const maxLoad = 2020
        showLoadingScreen(false, 'wizard', maxLoad)
        this.setUp(true);loadedMesh++

        const result = await this.getCharacDetailsOnline()
        this.setDetails(result) ; loadedMesh++
        this.setHTMLUI(this.det)
        const scene = new Scene(this._engine);

        scene.actionManager = new ActionManager(scene);
        this.activateGlow(1.5, scene)
        this.creationOfFakeShadow(scene)
        light = new DirectionalLight("dirLight", new Vector3(0, -1, -0.3), scene);
        light.intensity = .5

        pointLight = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(0, 1,0), new BABYLON.Vector3(0, -1, 0), Math.PI+1, 2, scene);
        hemLight = new HemisphericLight("light", new Vector3(0,10,2), scene)
        hemLight.intensity = .8

        shadowGen = new ShadowGenerator(1024, light);

        this._loadCharacterSounds(scene)

        const cam = this.arcCam(scene)

        this.createBlock(100,180,{x: 0, z: -100}, 0, scene);
        this.createBlock(100,65,{x: 36, z: 77}, 0, scene);
        this.createBlock(100,55,{x: -50, z: 77}, 0, scene);
        this.createBlock(100,190,{x: -81, z: 0}, Math.PI/2, scene);
        this.createBlock(100,190,{x: 81, z: 0}, Math.PI/2, scene);

        // sound
        new BABYLON.Sound("swampforestSound", "sounds/swampforestS.mp3", scene,
        null, {volume: .3, autoplay: true, loop: true})

        // update naten muna ang loc naten para di magkagulo sa socketio
        // this.createFog(scene, 0.002)

        const Ground = this.createGround(scene, "./images/modeltex/hiddenlandTex4.jpg",200)
        Ground.diffuseTex.uScale = 28
        Ground.diffuseTex.vScale = 28
        this.createSwmpTile(scene)

        this.createSwamps("./images/modeltex/grassGround.png", scene, {x: 0, z: 0}, 100,{min: -25, max:25}, {min: -95,max: -130})
        
        const Cliff = await this.importMesh(scene, "./models/", "cliffs.glb")
        Cliff.meshes[1].parent = null
        Cliff.meshes[1].position = new Vector3(-110.9,0,20)
        Cliff.meshes[0] = null;

        await this.createNecessary(scene);
        await this.createWoodPlank();
        await this.forestCreations(scene)
        this.createDangerSign(scene, {x: -3, y:.6, z: 75}, {x: 0,z:0});
        theCharacterRoot = await BABYLON.SceneLoader.LoadAssetContainerAsync("./models/", "gameCharac.glb", scene)
        goblinRoot = await BABYLON.SceneLoader.LoadAssetContainerAsync("./models/mons/", "goblinGreen.glb", scene)
        minotaurRoot = await BABYLON.SceneLoader.LoadAssetContainerAsync("./models/mons/", "minotaur.glb", scene)
        snakeRoot = await BABYLON.SceneLoader.LoadAssetContainerAsync("./models/mons/", "snake.glb", scene)
        golemRoot = await BABYLON.SceneLoader.LoadAssetContainerAsync("./models/mons/", "golem.glb", scene)
        wolfRoot = await BABYLON.SceneLoader.LoadAssetContainerAsync("./models/mons/", "wolf.glb", scene)
        
        // const Golem = await this.importMesh(scene, "./models/mons/", "golem.glb");
        // Golem.meshes[0].position.z = -31
        // box to follow
        const btf = this.createBoxToFollow(scene)
        this.myChar = this.createCharacter(this.det, theCharacterRoot, scene, shadowGen, false,true, allsword, allhelmets, allshields, light, 1.7)
        myCharDet = this.myChar; 
        
        if(this.prevPlace === 'swampforest') this.myChar.bx.position = new Vector3(0,this.yPos,-80)
        // npcInfos.forEach(npz => this.createNpc(theCharacterRoot, npz, true, btf))

        // CLIFFS 
        this.createClone(Cliff.meshes[1], 'cliff', {x:96.10,y:0,z:-60.79}, 0, scene)
        this.createClone(Cliff.meshes[1], 'cliff', {x:96.10,y:0,z:0.79}, 0, scene)
        this.createClone(Cliff.meshes[1], 'cliff', {x:96.10,y:0,z:55}, 0, scene)

        this.createClone(Cliff.meshes[1], 'cliff', {x:-96.10,y:0,z:-60.79}, 0, scene)
        this.createClone(Cliff.meshes[1], 'cliff', {x:-96.10,y:0,z:0.79}, 0, scene)
        this.createClone(Cliff.meshes[1], 'cliff', {x:-96.10,y:0,z:55}, 0, scene)

        this.createClone(Cliff.meshes[1], 'cliff', {x:67,y:0,z:92}, -Math.PI/2, scene)
        const leftClifClone = this.createClone(Cliff.meshes[1], 'cliff', {x:35,y:0,z:92}, -Math.PI/2, scene)
        const rightClifClone = this.createClone(Cliff.meshes[1], 'cliff', {x:-50,y:0,z:92}, -Math.PI/2, scene)
        
        this.createClone(Cliff.meshes[1], 'cliff', {x:67,y:0,z:-110}, -Math.PI/2, scene)
        this.createClone(Cliff.meshes[1], 'cliff', {x:35,y:0,z:-110}, -Math.PI/2, scene)
        this.createClone(Cliff.meshes[1], 'cliff', {x:-50,y:0,z:-110}, -Math.PI/2, scene)

        const Iron = await this.importMesh(scene, "./models/", "iron.glb")
        Iron.meshes[1].parent = null
        Iron.meshes[1].position = new Vector3(2,0,0)
        Iron.meshes[0] = null
        ironMesh = Iron.meshes[1];

        // const Seed = await this.importMesh(scene, "./models/", "seed.glb")
        // Seed.meshes[1].parent = null
        // Seed.meshes[1].position = new Vector3(0,0,0)
        // seedMesh = Seed.meshes[1]
        const Block = await this.importMesh(scene, "./models/", "block.glb")
        Block.meshes[1].parent = null

        this.runLifeManaStaminaRegen()
        this.camSetTarg(this.myChar.camTarg, cam, -Math.PI/2, 5);
        
        await this.createIns("tingrass.glb",{x:0, y: -.1, z:0}, 1000, {xmin: -80, xmax: 80}, {zmin: -80, zmax: 80}, {miny: -.3, maxy: .2})
        // await this.createIns("tingrass.glb",{x:63, y: -.1, z:0}, 900, {xmin: -15, xmax: 15}, {zmin: -73, zmax: 73}, {miny: -.3, maxy: .2})
        // await this.createIns("tingrass.glb",{x:1, y: -.1, z:57}, 500, {xmin: -75, xmax: 75}, {zmin: -13, zmax: 13}, {miny: -.2, maxy: .2})
        
        await this.createInstances("grass2",1200, -70, 70, scene);
        await this.createPeeble("./images/modeltex/rockTexBrown.png", scene, 50, {xmin: -70, xmax: 70}, {zmin: -80, zmax: 80})

        await scene.whenReadyAsync()
        this._scene.dispose()
        this._scene = scene
        
        this.arrangeCam(-1.4, 1.15)

        removeHomePage()
        loadedMesh = maxLoad
        openGameUI(this.det)
        
        this.showMapName('Hidden Land', 3800);
        this.allCanPress()
        this.initPressControllers(scene)

        this.weJoinTheServer({x:0,z:0})

        for(var plankzqnty = -35;plankzqnty < 30; plankzqnty+=1 + Math.random()*.8){
            this.createRoadPlank({x: plankzqnty, z: 85}, Math.random()*.2)
            this.createRoadPlank({x: plankzqnty, z: 78}, Math.random()*.2)
        }
        
        // PATH TO SWAMPFOREST
        const pathToSwamp = this.createPath(6, {x: -6, z: -99}, scene);
        this.toRegAction(pathToSwamp, this.myChar.bx, async () => {
            this.stopPress(true)
            this.prevPlace = 'hiddenland'
            this.setUp(true)
            displayElems([apartInfos], "none")
            displayElems([aprtLoadingBx, apartCont], "flex")
            aprtLoadLabel.innerHTML = "Outside..."
            this.socket.emit("dispose", {_id:this.det._id, place: this.currentPlace})
            await this.updatePlace('swampforest')
            showLoadingScreen(false, 'wizard')
            this.resetMeshes()
            isLoading = true
            await this._swampForest()
        })
        hideLScreen();
        this.saveMyCurrentLoc();

        const renderThis = () => {
            this.actionAndMovement(this.btf)
            this.renderMonsters()
        }
        scene.registerBeforeRender(renderThis)
        if(this.myChar.bx.position.z === 0){
            this.myChar.bx.position = new Vector3(0,this.yPos, -30)
            this.saveMyCurrentLoc();
        } 
        window.innerHeight < 650 && this._makeJoyStick(this.socket, cam,scene, true)
        this.registerBlocks(this.myChar, .1);
        this.checkAll();
    }
    async _dungeon(dungeonType, floorNum, haveBoss){
        
        worldChatCont.style.display = "none"
        let monsSpawnInterval
        const floorNumber = parseInt(floorNum)

        const toLoad = 850
        
        showLoadingScreen(false, 'wizard', toLoad)
        this.stopPress(true)
        this.setUp(false)
        const result = await this.getCharacDetailsOnline()
        this.setDetails(result)
        this.setHTMLUI(this.det)
        const scene = new Scene(this._engine)
        light = new DirectionalLight("dungLight", new Vector3(0, -1, -0.3), scene);
        light.intensity = .6
        hemLight = new HemisphericLight("light", new Vector3(0,10,1), scene)
        hemLight.intensity = .5
        pointLight = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(0, 1,0), new BABYLON.Vector3(0, -1, 0), Math.PI+1, 2, scene);

        scene.actionManager = new ActionManager(scene)
        scene.clearColor = new Color3(0,0,0)
        shadowGen = new ShadowGenerator(1024, light);
        this.disablePointerPicks(scene);

        this._loadCharacterSounds(scene);
        this._loadDungeonSounds()

        this.createMainHitBox(scene, "rockTexWall.jpg", 2, 10)
          
        this.runLifeManaStaminaRegen()

        const cam = this.arcCam(scene)
        cam.attachControl(canvas, true)
        cam.checkCollisions = true

        this.createFog(scene,.02)
        this.createBoxToFollow(scene)

        const Tile = await this.importMesh(scene, "./models/", "tile.glb");
        const dWallPosY = 4.5
        for(var i = -110; i <= 114;i+=7){

            // left wall
            const tileIns = Tile.meshes[1].createInstance("wall");
            tileIns.parent = null
            tileIns.position = new Vector3(-36,dWallPosY,i);
            tileIns.rotation = new Vector3(0,0,-Math.PI/2)
            tileIns.checkCollisions = true
            this.freeze(tileIns);

            // right wall
            const rightWallIns = Tile.meshes[1].createInstance("wall");
            rightWallIns.parent = null
            rightWallIns.position = new Vector3(36,dWallPosY,i);
            rightWallIns.rotation = new Vector3(0,0,Math.PI/2)
            rightWallIns.checkCollisions = true
            this.freeze(rightWallIns);

            if(i > -40 && i < 40){
                const backTile = Tile.meshes[1].createInstance("wall");
                backTile.parent = null
                backTile.position = new Vector3(i,dWallPosY,-106.4);
                backTile.rotation = new Vector3(Math.PI/2,0,0)
                backTile.checkCollisions = true
                this.freeze(backTile);

                const otherBackTile = Tile.meshes[1].createInstance("wall");
                otherBackTile.parent = null
                otherBackTile.position = new Vector3(i,dWallPosY,105.6);
                otherBackTile.rotation = new Vector3(-Math.PI/2,0,0)
                otherBackTile.checkCollisions = true
                this.freeze(otherBackTile);
            }

        }

        const thePeeble = await this.createPeeble("./images/modeltex/rockTexWhite.png", scene, 300, {xmin: -60, xmax: 120}, {zmin: -250, zmax: 500 });
        thePeeble.position.y+= 1

        const SharpROCK = await this.importMesh(scene, "./models/", "sharpRock.glb")
        sharpRock = SharpROCK.meshes[1]


        const dGround = MeshBuilder.CreateGround("ground", { width: 100, height: 300}, scene)
        dGround.isVisible = false;dGround.position.y-=.2        

        await this.createNecessary(scene)
        await this.createDungeonTiles(scene)
        await this.createBonFire(true, scene);
        const Spike = await this.importMesh(scene, "./models/", "spikes.glb")
        Spike.meshes[1].checkCollisions = true;Spike.meshes[1].setParent(null)

        const Crys = await this.importMesh(scene, "./models/", "crystalglow.glb")
        Crys.meshes[1].parent = null

        const newMat = new StandardMaterial("glowingMat")
        newMat.emissiveColor = new Color3(0.24, 0, 1)
        newMat.specularColor = new Color3(0,0,0)
        Crys.meshes[1].material = newMat

        const CrysDirt = await this.importMesh(scene, "./models/", "crystalDirt.glb")
        CrysDirt.meshes[1].parent = null

        if(floorNumber === 1){
            const dungeonGate = await this.importMesh(scene, "./models/", "dungeonGate.glb");
            dungeonGate.meshes[0].position = new Vector3(0,0,-106.2)
            dungeonGate.meshes[0].addRotation(0,Math.PI,0)
        }

        // let rocksLeft = -110
        // while(rocksLeft <= 120){
        //     const roRotat = Math.random() <= .6
        //     const scaleR = .5 + Math.random() * 1
        //     let dungNum = Math.floor(Math.random()*4)
        //     if(dungNum === 0) dungNum = 1
        //     const newRock = this.createComplicatedIns(Spike.meshes[1], 'bigrock', {x: -17 + Math.random() * .5,y: -Math.random()*1.5, z: rocksLeft + Math.random()*5}, roRotat && Math.PI *.2, scene, {ran: scaleR})

        //     this.blocks.push(newRock)
        //     rocksLeft+=3
        // }
        // let rocksR = -110
        // while(rocksR <= 120){
        //     const roRotat = Math.random() <= .6
        //     const scaleR = .5 + Math.random() * 1
        //     let dungNum = Math.floor(Math.random()*4)
        //     if(dungNum === 0) dungNum = 1
        //     const newRock = this.createComplicatedIns(Spike.meshes[1], 'bigrock', {x: 17 + Math.random() * .5,y: -Math.random()*1.5, z: rocksR + Math.random() * 4}, roRotat && Math.PI *.2, scene, {ran: scaleR})

        //     this.blocks.push(newRock)
        //     rocksR+=3
        // };

        // let bigRLeft = -100
        // while(bigRLeft <= 100){
        //     const roRotat = Math.random() <= .6
        //     const scaleR = 2 + Math.random() * 1
        //     let dungNum = Math.floor(Math.random()*4)
        //     if(dungNum === 0) dungNum = 1
        //     const newRock = this.createComplicatedIns(Spike.meshes[1], 'bigrock', {x: -26 + Math.random() * .5,y: -Math.random()*1.5, z: bigRLeft + Math.random()*5}, Math.random()*4, scene, {ran: scaleR})
 
        //     this.blocks.push(newRock)
        //     bigRLeft+=12
        // }
        // let bigRri = -100
        // while(bigRri <= 100){
        //     const roRotat = Math.random() <= .6
        //     const scaleR = 2 + Math.random() * 1
        //     let dungNum = Math.floor(Math.random()*4)
        //     if(dungNum === 0) dungNum = 1
        //     const newRock = this.createComplicatedIns(Spike.meshes[1], 'bigrock', {x: 26 + Math.random() * .5,y: -Math.random()*1.5, z: bigRri + Math.random() * 4}, Math.random()*4, scene, {ran: scaleR})

        //     this.blocks.push(newRock)
        //     bigRri+=12
        // };

        if(floorNumber >= 5){
            let crysNums = -10
            while(crysNums <= floorNumber){
                let crystalName = Math.random()*10 > 9 ? 'redberyl' : 'azurite'
                const scaleR = .4 + Math.random() * .3
                const posXR = Math.random() * 54
                const crysglow = this.createCrystal(makeRandNum(),Crys.meshes[1], crystalName, {x: -34 + posXR,y: -.2, z: crysNums}, 2, 0, scene, scaleR)
                const newcrstal = this.createCrystal(makeRandNum(),CrysDirt.meshes[1], crystalName, {x: -34 + posXR,y: -.2, z: crysNums}, 2, 0, scene, scaleR)
                crysNums+=10
                this.blocks.push(newcrstal)
            }
        }
        loadingWhat = `creating recources ..`
        let theCharacterRoot = await BABYLON.SceneLoader.LoadAssetContainerAsync("./models/", "gameCharac.glb", scene)
        let ghostRoot = await BABYLON.SceneLoader.LoadAssetContainerAsync("./models/mons/", "ghost.glb", scene)
        let slimeBlueRoot = await BABYLON.SceneLoader.LoadAssetContainerAsync("./models/mons/", "slimeBlue.glb", scene)
        let spiderBossRoot = await BABYLON.SceneLoader.LoadAssetContainerAsync("./models/mons/", "spiderBoss.glb", scene)
        wolfRoot = await BABYLON.SceneLoader.LoadAssetContainerAsync("./models/mons/", "wolf.glb", scene)

        this.myChar = this.createCharacter(this.det,theCharacterRoot,scene, shadowGen,false,true, allsword, allhelmets, allshields, light, 1.7)
        myCharDet = this.myChar;
   
        const demonArray = allDemonz(floorNumber);
        
        let demonNum = "none"
        if(floorNumber >= 2 && floorNumber <= 4) demonNum = 0
        if(floorNumber >= 5 && floorNumber <= 7) demonNum = 1
        if(demonNum !== "none") this.createDemon(theCharacterRoot, demonArray[demonNum], this.btf, scene)
        this.Crytalz.forEach(cryz => {
            cryz.mesh.actionManager = new ActionManager(scene)
            this.toRegAction(cryz.mesh, this.myChar.detector, () => {
                this.openPopUpAction('mine')
                this.targetRecource = cryz.mesh
            })
            this.toRegActionExit(cryz.mesh, this.myChar.detector, () => {
                this.closePopUpAction()
                this.targetRecource = undefined
            })
        })

        // MONSTERS
        let slimeHp = 70 * floorNumber
        let ghostHp = 150 * floorNumber
        let spiderHp = 290 * floorNumber

        let slimeAtkInterval = 2400;
        let otherAtkInterval = 2000;

        let slimeDmg = 10 * floorNumber
        let ghostDmg = 16 * floorNumber;

        let slimeExpGain = 15 * floorNumber
        let slimeBreed = "normal"
        
        let leftMons = -80
        while(leftMons <= 90){            
            floorNumber >= 2 && this.createMonster(ghostRoot, shadowGen, true, makeRandNum(), 'ghost', undefined, { x: -20 + Math.random()*3, z: leftMons}, 3, ghostHp, ghostHp, 2, otherAtkInterval, ghostDmg, scene, undefined, slimeExpGain, "normal")
            floorNumber < 4 && this.createMonster(slimeBlueRoot, shadowGen, false, makeRandNum(), 'slime', undefined, { x: -15, z: leftMons}, 3, slimeHp, slimeHp, 2, slimeAtkInterval, slimeDmg, scene, undefined, slimeExpGain, "normal")
            leftMons+= 25
        }
        let rightMons = -70
        while(rightMons <= 110){
            floorNumber >= 3 && this.createMonster(ghostRoot, shadowGen, true, makeRandNum(), 'ghost', undefined, { x: 20 + Math.random()*3, z: rightMons + Math.random()*3}, 3, ghostHp, ghostHp, 2, otherAtkInterval, ghostDmg, scene, undefined, slimeExpGain, "normal")
            this.createMonster(slimeBlueRoot, shadowGen, false, makeRandNum(), 'slime', undefined, { x: 10, z: rightMons + Math.random()*3}, 3, slimeHp, slimeHp, 2, slimeAtkInterval, slimeDmg, scene, undefined, slimeExpGain, "normal")
            // eater
            floorNumber >= 4 && this.createMonster(spiderBossRoot, shadowGen, false, makeRandNum(), "eater", undefined, { x: 1 + Math.random()*3, z: rightMons + Math.random()*1}, 3, spiderHp, spiderHp, floorNumber, otherAtkInterval, ghostDmg, scene, undefined, 90*floorNumber, "normal",
            { effectType: "poisoned", chance: 6, dura: 1000, plusDmg: 50 * floorNumber, dmgPm: 30 })
            rightMons+= 25
            // wolf
            const houndInfo = {
                effects: { effectType: "absorb", absorbType: "weapon", defaultAbs: 20, chance: 9, dura: 100, plusDmg: 10, dmgPm: 0 }
            }
            if(floorNumber > 4 && Math.random() > .5) this.createMonster(wolfRoot, shadowGen, false, makeRandNum(), "hellhound", "normal", {x: -30 + Math.random()*60, z: -100 + Math.random()*200}, 6, 300 * floorNumber, 300 * floorNumber, floorNumber, 1500, 12 * floorNumber, scene, false, 20 * floorNumber, "normal", houndInfo.effects)
        }
        // HITBOX
        for(var brickLength = 0;brickLength <= 30; brickLength+=1){ // right side of heartland
            this.createHitBx(scene, makeRandNum(), {x: -35 + Math.random()*2 , y: 1, z: -90 + Math.random()*150 }, 50+Math.random()*1, false, false, Math.random()>.9 ? 1 : 0, boxPos => {
                if(Math.random() > .8) {
                    if(floorNumber > 0 && floorNum < 2) this.createMonster(slimeBlueRoot, shadowGen, false, makeRandNum(), 'slime', undefined, { x: boxPos.x, z: boxPos.z}, 3, slimeHp, slimeHp, 2, slimeAtkInterval, slimeDmg, scene, undefined, slimeExpGain, "normal")
                    if(floorNumber > 2 && floorNum < 4) this.createMonster(ghostRoot, shadowGen, true, makeRandNum(), 'ghost', undefined, { x: boxPos.x, z: boxPos.z}, 3, ghostHp, ghostHp, 2, otherAtkInterval, ghostDmg, scene, undefined, slimeExpGain, "normal")
                    if(floorNumber > 4) this.createMonster(spiderBossRoot, shadowGen, false, makeRandNum(), "eater", undefined, { x: boxPos.x, z: boxPos.z}, 3, spiderHp, spiderHp, floorNumber, otherAtkInterval, ghostDmg, scene, undefined, 90*floorNumber, "normal",
                    { effectType: "poisoned", chance: 6, dura: 1000, plusDmg: 50 * floorNumber, dmgPm: 30 })
                }
            });
            this.createHitBx(scene, makeRandNum(), {x: 33 + Math.random()*2 , y: 1, z: -90 + Math.random()*150 }, 50+Math.random()*1, false, false, Math.random()>.9 ? 1 : 0, boxPos => {
                if(Math.random() > .8) {
                    if(floorNumber > 0 && floorNum < 2) this.createMonster(slimeBlueRoot, shadowGen, false, makeRandNum(), 'slime', undefined, { x: boxPos.x, z: boxPos.z}, 3, slimeHp, slimeHp, 2, slimeAtkInterval, slimeDmg, scene, undefined, slimeExpGain, "normal")
                    if(floorNumber > 2 && floorNum < 4) this.createMonster(ghostRoot, shadowGen, true, makeRandNum(), 'ghost', undefined, { x: boxPos.x, z: boxPos.z}, 3, ghostHp, ghostHp, 2, otherAtkInterval, ghostDmg, scene, undefined, slimeExpGain, "normal")
                    if(floorNumber > 4) this.createMonster(spiderBossRoot, shadowGen, false, makeRandNum(), "eater", undefined, { x: boxPos.x, z: boxPos.z}, 3, spiderHp, spiderHp, floorNumber, otherAtkInterval, ghostDmg, scene, undefined, 90*floorNumber, "normal",
                    { effectType: "poisoned", chance: 6, dura: 1000, plusDmg: 50 * floorNumber, dmgPm: 30 })
                }
            });
        } 

        this.createMonsterToChase(Monsterz, 'ghost', {x: 0, z: -30}, {width: 30}, 0, scene)
        this.createMonsterToChase(Monsterz, 'slime', {x: 0, z: 60}, {width: 30}, 0, scene)
        this.createMonsterToChase(Monsterz, 'eater', {x: 0, z: -30}, {width: 30}, 0, scene)
        this.createMonsterToChase(Monsterz, 'hellhound', {x: 0, z: 30}, {width: 30}, 0, scene)
        
        this.camSetTarg(this.myChar.camTarg, cam, -Math.PI/2, 5);

        const PathMod = await this.importMesh(scene, "./models/", 'portal.glb')
        PathMod.meshes[1].parent = null; PathMod.meshes[0].dispose()
        PathMod.meshes[1].position.z = -104;

        if(floorNumber < 8){
            // paths
            const startPath = this.createPath(5,  {x: 0, z: -106}, scene)
            startPath.actionManager.registerAction(new ExecuteCodeAction(
                {
                    trigger: ActionManager.OnIntersectionEnterTrigger,
                    parameter: this.myChar.bx
                }, async e => {
                    if(this.currentPlace.includes('dungeon')){
                        this._allSounds.enteringHoleS.play()
                        clearInterval(monsSpawnInterval)
                        if(parseInt(floorNumber) === 1){
                            this.stopPress(true)
                            this.prevPlace = 'dungeon'
                            this.setUp(true)
                            displayElems([apartInfos], "none")
                            displayElems([aprtLoadingBx, apartCont], "flex")
                            aprtLoadLabel.innerHTML = "Outside..."
    
                            await this.updatePlace('swampforest')
                            showLoadingScreen(false, 'wizard')
                            this.emptyArray()
                            Monsterz.forEach(mons => mons.body.position.y = 100)
                            demons.forEach(mons => mons.bx.position.y = 100)
                            await this._swampForest()
                            return log('going to swampforest')
                        }     
                        let floor = parseInt(floorNumber) - 1
                        log(`this is start path going to floor ${floor}`)
                        await this._dungeon('Normal', floor, false)
                        this.myChar.bx.position = new Vector3(0,this.yPos,95)
                        this.arrangeCam(-1.4, -1.15)
                    }                
                }
            ))

            this.createClone(PathMod.meshes[1], 'cliff', {x: 0, z: 103}, 0, scene)
            const endPath = this.createPath(5,  {x: 0, z:105.5}, scene)
            endPath.actionManager.registerAction(new ExecuteCodeAction(
                {
                    trigger: ActionManager.OnIntersectionEnterTrigger,
                    parameter: this.myChar.bx
                }, async e => { 
                    this._allSounds.enteringHoleS.play()
                    clearInterval(monsSpawnInterval)               
                    let floor = parseInt(floorNumber)
                    floor +=1
                    Monsterz.forEach(mons => mons.body.position.y = 100)
                    demons.forEach(mons => mons.bx.position.y = 100)
                    await this._dungeon('Normal', floor, true)
                    this.myChar.bx.position = new Vector3(0,this.yPos,-94)
                    this.arrangeCam(-1.4, 1.15)
                    await this.updateLocOnline({x: 0, z:-30}, {x: 0, z: -94})                
                }
            ))
        }

        this.createSceneGlow(1, scene)

        const trapDmg = 50*floorNumber
        this.createTrap(this.det._id, "earth", {x: 0, y: .2, z: -70}, 2400,trapDmg, 1000, 2)
        let trapTill = 70;
        let startingTrap = -80
        while(startingTrap <= trapTill){
            this.createTrap(this.det._id, "earth", {x: -9 + Math.random()*20, y: .2, z: startingTrap}, 2400, trapDmg, 1000, 2)
            startingTrap+=3
        }
        this.createBlock(100,100,{x: 0, z: -106}, 0, scene);
        this.createBlock(100,100,{x: 0, z: 106}, 0, scene);

        await scene.whenReadyAsync()
        this._scene.dispose()
        this._scene = scene
        this._allSounds.enteredS.play()
        removeHomePage()
        loadedMesh = toLoad
        hideLScreen()
        openGameUI(this.det)
        this.allCanPress()
        this.showMapName(`Dungeon ${floorNumber}`, 3000)
        this.initPressControllers(scene)
        log(this.prevPlace)
        if(this.prevPlace === "swampforest"){
            this.myChar.bx.position = new Vector3(0,this.yPos,-95)
            this.arrangeCam(-1.4, 1.15)
            await this.updateLocOnline({x:0,z: 20}, {x: 0, z: -95})
        }
        await this.updatePlace(`dungeon${dungeonType}.${floorNumber}`)

        if(floorNumber > 1 && floorNumber < 8){
            this.createFloor("./images/modeltex/holeTex.png", scene, {x: 11, z: -65}, true)

            const pathToFirstFloor = this.createPath(2, {x:11,z: -65}, scene)
            this.toRegAction(pathToFirstFloor, this.myChar.bx, async () => {
                clearInterval(monsSpawnInterval)
                Monsterz.forEach(mons => mons.body.position.y = 100)
                await this._dungeon("Normal", 1, false)
                this.stopMyCharacter();
                this.stopPress();
                this.myChar.mode = "onground"
                this.myChar.bx.position = new Vector3(11,this.yPos,-65)
                
                setTimeout(() => {
                    this.myChar.mode = "none"
                    this.playAnim(this.myChar.anims, 'willstand')
                    this.allCanPress()
                    setTimeout(() => this.myChar.mode = "stand", 500)
                }, 3000)
            })
        }
        
        const toRender = () => {
            this.actionAndMovement(this.btf, this.cam)
            this.renderMonsters()
        }
        scene.registerBeforeRender(toRender)
 
        Crys.meshes.forEach(mesh => mesh.isVisible = false);
        CrysDirt.meshes.forEach(mesh => mesh.isVisible = false);
        Spike.meshes.forEach(mesh => mesh.position.y+=100);
        window.innerHeight < 650 && this._makeJoyStick(this.socket, cam,scene, false)
        this.registerBlocks(this.myChar, .09);
    }
    async _heartLand(){
        this.emptyArray();
        if(isInTutorialMode) isInTutorialMode = false
        worldChatCont.style.display = "flex"
        const maxLoad = 320
        showLoadingScreen(false, 'wizard', maxLoad)
        this.setUp(true); loadedMesh++

        const result = await this.getCharacDetailsOnline()
        this.setDetails(result); loadedMesh++
        this.setHTMLUI(this.det)
        
        const scene = new Scene(this._engine)
        const gl = new BABYLON.GlowLayer("glow", scene);
        gl.intensity = 2

        this.createMainHitBox(scene, "woodenBx.jpg", .7)

        const explodingSmoke = this.createExplodingSmoke()
        // sound
        this.playPlaceMusic(scene, "heartland", 60000 * 3)

        scene.actionManager = new ActionManager(scene)

        light = new DirectionalLight("dirLight", new Vector3(.4, -3, -.5), scene);
        hemLight = new HemisphericLight("light", new Vector3(0,10,2), scene)
        hemLight.intensity = .7
        light.intensity = .5
        pointLight = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(0, 1,0), new BABYLON.Vector3(0, -1, 0), Math.PI+1, 2, scene);

        shadowGen = new ShadowGenerator(1024, light);
        
        scene.ambientColor = Color3.FromInts(10, 30, 10);
        scene.clearColor = Color3.FromInts(127, 165, 13);

        this._loadCharacterSounds(scene)

        cam = this.arcCam(scene)

        this.createGround(scene, "./images/modeltex/swampFTex.jpg",200)
        
        // this.createHeartLandTile(scene)

        const medHouse = await this.importMesh(scene, "./models/", "medhouse1.glb")
        medHouse.meshes[0].position = new Vector3(0,0,-30)
        allHouses = medHouse.meshes[0].getChildren();

        await this.createWoodPlank();
        this.createHLPlanks()
        
        await this.createNecessary(scene)

        theCharacterRoot = await BABYLON.SceneLoader.LoadAssetContainerAsync("./models/", "gameCharac.glb", scene)
        rabbit = await BABYLON.SceneLoader.LoadAssetContainerAsync("./models/mons/", "rabbit.glb", scene)
        
        // box to follow && character
        const btf = this.createBoxToFollow(scene)
        this.myChar = this.createCharacter(this.det, theCharacterRoot, scene, shadowGen, false,true, allsword, allhelmets, allshields, light, 1.7)
        myCharDet = this.myChar

        npcInfos.forEach(npz => {
            const notYetTalked = this.det.storyQue.some(stryName => stryName === "firstFriend")
            if(npz.name === "Nick" && !notYetTalked) return
            this.createNpc(theCharacterRoot, npz, false, btf)
        })
        await this.createMerchant(scene, {x: -7,y:0,z:53.5}, {x: -1.8, z: 52})
        await this.createBonFire(true, scene);

        for(var bxLength = 5;bxLength <= 52; bxLength+=5){ // right side of heartland
            if(Math.random()>.5) this.createHitBx(scene, makeRandNum(), {x: bxLength, y: .35, z: 25+Math.random()*1}, 10+Math.random()*50, false, false, Math.random()>.9 ? 1 : 0);
            if(Math.random()>.5) this.createHitBx(scene, makeRandNum(), {x: bxLength, y: .35, z: -44+Math.random()*1}, 10+Math.random()*50, false, false, Math.random()>.85 ? 1 : 0);
            if(Math.random()>.5) this.createHitBx(scene, makeRandNum(), {x: bxLength, y: .35, z: -25+Math.random()*1}, 10+Math.random()*50, false, false, Math.random()>.9 ? 1 : 0);
        }
        for(var bxLength = -6;bxLength >= -52; bxLength-=5){ // left side of heartland
            if(Math.random()>.5) this.createHitBx(scene, makeRandNum(), {x: bxLength, y: .35, z: 34+Math.random()*3}, 10+Math.random()*50, false, false, Math.random()>.9 ? 1 : 0);
            if(Math.random()>.5) this.createHitBx(scene, makeRandNum(), {x: bxLength, y: .35, z: -44+Math.random()*1}, 10+Math.random()*50, false, false, Math.random()>.85 ? 1 : 0);
            if(Math.random()>.5) this.createHitBx(scene, makeRandNum(), {x: bxLength, y: .35, z: -25+Math.random()*1}, 10+Math.random()*50, false, false, Math.random()>.95 ? 1 : 0);
            if(Math.random()>.5) this.createHitBx(scene, makeRandNum(), {x: bxLength, y: .35, z: -4+Math.random()*1}, 10+Math.random()*50, false, false, Math.random()>.95 ? 1 : 0);
        }
        // createTorch
        const leftTorch = await this.importMesh(scene, "./models/", "bigtorch.glb", true)
        leftTorch.position = new Vector3(7,0,-75)
        this.blocks.push(leftTorch);
        this.craftBonFire({x: 7, y: 4.7, z: -75}, .5, false)
        this.freeze(leftTorch)
        //right torch
        this.createBigTorch(leftTorch, {x: -7, y:0, z:-75}, true)
        // dwarven torch
        this.createBigTorch(leftTorch, {x: -38, y:0, z:13}, true)
        this.createBigTorch(leftTorch, {x: -20, y:0, z:13}, true)
        this.createBigTorch(leftTorch, {x: -9, y:0, z:13}, true)
        this.createBigTorch(leftTorch, {x: -32, y:0, z:27.6}, true)
        this.createBigTorch(leftTorch, {x: -10, y:0, z:27.6}, true)
        this.createBigTorch(leftTorch, {x: -10, y:0, z:55}, true)
        //near tavern
        this.createBigTorch(leftTorch, {x: 28.7, y:0, z:7.88}, true)
        this.createBigTorch(leftTorch, {x: 47.7, y:0, z:8.64}, false)
        
        await this.createWagon({x:-25.33,y:0,z:69}, {x:15,y:0,z:59},scene)

        const slaveCart = await this.importMesh(scene, "./models/", "slaveCart.glb")
        slaveCart.meshes[1].parent = null
        slaveCart.meshes[1].position = new Vector3(54,0,-14);
        slaveCart.meshes[1].rotationQuaternion = null
        slaveCart.meshes[1].lookAt(new Vector3(58,0,-3), 0,0,0)
        this.blocks.push(slaveCart.meshes[1])
        this.putFakeShadow(slaveCart.meshes[1], 9, .02)
        this.freeze(slaveCart.meshes[1])
        // const feetSmoke = this.createFeetSmoke(explodingSmoke, .03,.5, 1000, 0,this.myChar.bx)
        // feetSmoke.stop()
        // setTimeout(() => {
        //     feetSmoke.start();
        //     feetSmoke.targetStopDuration = .08
        // }, 4000)
        // const bigSmokeBurst = this.createFeetSmoke(explodingSmoke, 15,20, 10000, 3, this.myChar.bx)
        // bigSmokeBurst.stop()
        // setTimeout(() => {
        //     bigSmokeBurst.createSphereEmitter(5, 0)
        //     bigSmokeBurst.start();
        //     bigSmokeBurst.updateSpeed = .2
        //     bigSmokeBurst.targetStopDuration = .7
        // }, 6000)

        const Cliff = await this.importMesh(scene, "./models/", "cliffs.glb")
        Cliff.meshes[1].parent = null
        Cliff.meshes[1].position = new Vector3(-110.9,0,20)
        Cliff.meshes[0] = null;

        await this.createPeeble("./images/modeltex/rockTexBrown.png", scene, 200, {xmin: -80, xmax: 160}, {zmin: -180, zmax: 350})

        await this.outGateC(scene, {x: 0,y:0,z:-83});

        const {rockRoot} = await this.createRuneRock(scene, {x: 51, z: 1.14}, rgbColors[1].rgb)
        rockRoot.lookAt(new Vector3(0,0,1.14),0,0,0, BABYLON.Space.WORLD)
        rockRoot.rotationQuaternion = null
        // CLIFFS 
        this.createClone(Cliff.meshes[1], 'cliff', {x:96.10,y:0,z:-60.79}, 0, scene)
        this.createClone(Cliff.meshes[1], 'cliff', {x:96.10,y:0,z:0.79}, 0, scene)
        this.createClone(Cliff.meshes[1], 'cliff', {x:96.10,y:0,z:55}, 0, scene)

        this.createClone(Cliff.meshes[1], 'cliff', {x:-96.10,y:0,z:-60.79}, 0, scene)
        this.createClone(Cliff.meshes[1], 'cliff', {x:-96.10,y:0,z:0.79}, 0, scene)
        this.createClone(Cliff.meshes[1], 'cliff', {x:-96.10,y:0,z:55}, 0, scene)

        this.createClone(Cliff.meshes[1], 'cliff', {x:67,y:0,z:92}, -Math.PI/2, scene)
        this.createClone(Cliff.meshes[1], 'cliff', {x:6,y:0,z:92}, -Math.PI/2, scene)
        this.createClone(Cliff.meshes[1], 'cliff', {x:-50,y:0,z:92}, -Math.PI/2, scene)

        this.createClone(Cliff.meshes[1], 'cliff', {x:67,y:0,z:-95}, -Math.PI/2, scene)
        this.createClone(Cliff.meshes[1], 'cliff', {x:6,y:0,z:-101}, -Math.PI/2, scene)
        this.createClone(Cliff.meshes[1], 'cliff', {x:-50,y:0,z:-95}, -Math.PI/2, scene)

        const Seed = await this.importMesh(scene, "./models/", "seed.glb")
        Seed.meshes[1].parent = null
        Seed.meshes[1].position = new Vector3(0,0,0)
        Seed.meshes[0] = null

        const Dig = await this.importMesh(scene, "./models/", "dig.glb")
        digMesh = Dig.meshes[1];

        const Tree = await this.importMesh(scene,"./models/", "tree.glb");
        wholeTree = Tree.meshes[1]

        this.runLifeManaStaminaRegen()

        this.camSetTarg(this.myChar.camTarg, cam, -Math.PI/2, 5)
        switch(this.prevPlace){
            case "guildhouse":
                this.playerLookAt(this.myChar.bx, {x:0,y:this.yPos,z:0})
                this.arrangeCam(-1.4, 1.15)
            break
            case "room":
                this.myChar.bx.position = new Vector3(this.prevLoc.x,this.yPos, this.prevLoc.z)
            break
            case "swampforest":
                this.myChar.bx.position = new Vector3(0,this.yPos,-70)
                this.myChar.bx.lookAt(new Vector3(0,this.yPos,0),0,0,0)
                this.arrangeCam(-1.4, 1.15)
            break
            case "crafthouse":
                this.myChar.bx.position = new Vector3(-40,this.yPos,22)
                this.myChar.bx.lookAt(new Vector3(0,this.yPos,0),0,0,0)
            break
            // NO NEED TO PUT DEFAULT
            // IN CHARACTER CREATION IT'S ALREADY ASIGNING POS FROM DB
        }
        log(`this.prevPlace is ${this.prevPlace}`)
        await this.createInstances("grass2",1000, -70, 120, scene);
        
        let myTargCurr = undefined
        if(this.det.storyQue.some(queName => queName === "firstFriend") && this.det.rank === "none"){
            if(this.det.places.length <= 1){
                this.myChar.bx.position = new Vector3(9, this.yPos, 13.5)
                myTargCurr = {x:10.4, z: 11.5}
                this.playerLookAt(this.myChar.bx, myTargCurr)
                this.arrangeCam(-1.4, -1.15);
                this.det.x = 9
                this.det.z = 13.5
                const nikNpc = simpleNpc.find(npz => npz.name === "Nick");
                if(nikNpc){
                    closeGameUI()
                    
                    const npcInfo = npcInfos.find(npz => npz.name === "Nick")
                    this.targetRecource = nikNpc.bx
                    this.targDetail = npcInfo.condition(this.det);
                    pacBtn.click()
                    this.closePopUpAction()
                    closeGameUI()
                }else{
                    alert("niko not found")
                }

            }
        }
        const Statue = await this.importMesh(scene, "./models/", "statueOfHero.glb")
        Statue.meshes[0].position = new Vector3(-0.7, 1, -15.12);
        Statue.meshes[0].scaling = new Vector3(2,2,2)
        this.putFakeShadow(Statue.meshes[0], 6, -.45)
        this.blocks.push(Statue.meshes[1])
        this.freeze(Statue.meshes[1])
        await scene.whenReadyAsync()
        this._scene.dispose()
        this._scene = scene
        
        removeHomePage()
        loadedMesh = maxLoad
        hideLScreen()
        if(!this.det.storyQue.some(queName => queName === "firstFriend")){
            openGameUI(this.det);
            this.allCanPress()
        }
        this.showMapName('Heart Land', 2800);
        // this.arrangeCam(-1.4, 1.15)

        // this.socket.emit("join", {...this.det,
        //     _moving: false,
        //     _attacking: false,
        //     _minning: false,
        //     _training: false,
        //     mode: "stand",
        //     dirTarg: 
        // })
        this.weJoinTheServer(myTargCurr ? myTargCurr : {x: 0, z: 0})
        this.initPressControllers(scene)

        this.createBlock(100,180,{x: 0, z: -81.5}, 0, scene);
        this.createBlock(100,180,{x: 0, z: 78}, 0, scene);
        this.createBlock(100,190,{x: -81, z: 0}, Math.PI/2, scene);
        this.createBlock(100,190,{x: 81, z: 0}, Math.PI/2, scene);

        this.saveMyCurrentLoc()
        const renderThis = () => {
            this.actionAndMovement(btf)
            this.renderMonsters()
        }
        scene.registerAfterRender(renderThis)

        // this.craftBonFire({x: 0, z: 4}, scene)
        // this.craftBonFire({x: 1, z: -4}, scene)

        const pathToOutside = this.createPath(3,{x: 0, z: -82.5}, scene)
        this.toRegAction(pathToOutside, this.myChar.bx, async () => {
            this._allSounds.enteringHoleS.play()
            this.stopPress(true)
            this.prevPlace = 'heartland'
            this.setUp(true)
            displayElems([apartInfos], "none")
            displayElems([aprtLoadingBx, apartCont], "flex")
            aprtLoadLabel.innerHTML = "Outside..."
            this.socket.emit("dispose", {_id:this.det._id, place: this.currentPlace})
    
            await this.updatePlace('swampforest')
            showLoadingScreen(false, 'wizard')
            this.resetMeshes()
            isLoading = true
            await this._swampForest()
        });
        
        window.innerHeight < 650 && this._makeJoyStick(this.socket, cam,scene, true)
        
        Tree.meshes[0].position.y = 100
        // CREATING THE GUILD HOUSE
        allHouses.forEach(allh => allh.position.y += 100)

        // craft house
        const craftHouse = await this.createImportantHouse("craftHouse.glb", {x: -48, y:0, z: 21}, { x: -44, y: .5, z: 23}, -Math.PI/2 ,scene)
        const theDoor = await this.importMesh(scene, "./models/", "smallDoor.glb")
        theDoor.meshes[0].position = new Vector3(-45,0,23)
        theDoor.meshes[0].rotationQuaternion = null
        theDoor.meshes[0].addRotation(0,Math.PI/2,0)
        this.createTextMesh(makeRandNum(), "Dwarven Shop", "white", {x: -44, y: 3, z: 23}, 100, scene, false)
        this.putFakeShadow(theDoor.meshes[1], 2, .02)
        this.toRegAction(this.myChar.bx, craftHouse.entrance, () => {
            this.openPopUpAction("info")
            this.targetRecource ='crafthouse'
            const myF = this.myChar.bx.position
            this.prevLoc = {x: myF.x, z:myF.z}
        })
        this.toRegActionExit(this.myChar.bx, craftHouse.entrance, () => {
            this.closePopUpAction()
            this.targetRecource = undefined
        })
        this.toRegAction(this.myChar.bx, craftHouse.impHouse, () => {
            this.stopPress(true)
            this.bump(this.myChar);
            const mypos = this.myChar.bx.position
            this.socketAvailable && this.socket.emit('userBump', {_id: this.det._id, pos:{ x: mypos.x, z: mypos.z }, 
            dirTarg: {x: this.btf.position.x, z: this.btf.position.z} })
            setTimeout(() => this.allCanPress, 2000)
        })
        // guild house
        const GUILD = await this.createImportantHouse("guildHouseHL.glb", {x: 0, y:0, z: 61}, { x: 0, y: .5, z: 57.5}, false, scene);

        await this.createTavern(scene);
        const clubPath = this.createPath(1.5, {x: 38.52, y: 0, z: 14.6}, scene)
        this.toRegAction(this.myChar.bx, clubPath, async () => {
            this.stopPress(true)
            this.prevPlace = 'heartland'
            this.setUp(true)
            displayElems([apartInfos], "none")
            displayElems([aprtLoadingBx, apartCont], "flex")
            aprtLoadLabel.innerHTML = "Going Inside..."
            this.socket.emit("dispose", {_id:this.det._id, place: this.currentPlace})
    
            await this.updatePlace('hl_club')
            showLoadingScreen(false, 'wizard')
            this.resetMeshes()
            isLoading = true
            await this._hl_club()
        })
        this.createTextMesh(makeRandNum(), "Tavern", "white", {x: 38.475, y: 4, z: 13.6 }, 100, scene, false)
        this.createTextMesh(makeRandNum(), "Guild", "white", {x: 0, y: 3, z: 56.2 }, 100, scene, false)
        this.toRegAction(this.myChar.bx, GUILD.entrance, () => {
            this.openPopUpAction("info")
            this.targetRecource ='guildhouse'
            const myF = this.myChar.bx.position
            this.prevLoc = {x: myF.x, z:myF.z}
        })
        this.toRegActionExit(this.myChar.bx, GUILD.entrance, () => {
            this.closePopUpAction()
            this.targetRecource = undefined
        })
        this.toRegAction(this.myChar.bx, GUILD.impHouse, () => {
            this.stopPress(true)
            this.bump(this.myChar);
            const mypos = this.myChar.bx.position
            this.socketAvailable && this.socket.emit('userBump', {_id: this.det._id, pos:{ x: mypos.x, z: mypos.z }, 
            dirTarg: {x: this.btf.position.x, z: this.btf.position.z} })
            setTimeout(() => this.allCanPress, 2000)
        })
        this.registerBlocks(this.myChar, .09)
        this.checkAll()
    }
    async _goToRoom(houseName){
        displayElems([apartCont, aprtLoadingBx], "none")
        displayElems([apartInfos], "flex")
        log(houseName)
        const houseNo = houseName.split(".")[1]

        showLoadingScreen(false, 'wizard')
        this.stopPress(true)
        this.setUp(false)
        const result = await this.getCharacDetailsOnline()
        this.setDetails(result)
        this.setHTMLUI(this.det)
        const isOnlyStarting = this.det.storyQue.some(storyName => storyName === "wakingUp")
        
        const scene = new Scene(this._engine)
        light = new DirectionalLight("dungLight", new Vector3(0, -1, -0.3), scene);
        hemLight = new HemisphericLight("light", new Vector3(0,10,1), scene)
        hemLight.intensity = 0.5
        scene.actionManager = new ActionManager(scene)
        scene.clearColor = new Color3(0,0,0)
        const shadowGen = new ShadowGenerator(1024, light);
        this.disablePointerPicks(scene)
        const gl = new BABYLON.GlowLayer("glow", scene);
        gl.intensity = 1.4
        if(isOnlyStarting) isInTutorialMode = true

        this._loadCharacterSounds(scene)

        this.runLifeManaStaminaRegen()
        const cam = this.arcCam(scene)
        this.createBoxToFollow(scene)

        // const theHouse = await this.importMesh(scene, "./models/", "medRooms.glb")
        // theHouse.meshes.forEach(mesh => mesh.receiveShadows = true)
        
        this.createWoodFloor(scene, 6, 6, {x:0, y:.01 ,z:2.4}, {w: 9, h: 12})
        await this.createWoodPlank(scene);

        this.createWoodTall({x: -4.2, y:1.5, z:-3.5}, 2.5, 1.5, { x: -3.7, z: 3})
        this.createWoodTall({x: 3.7, y:1.5, z:-3.5}, 2.5, 1.5, { x: 3.7, z: 3})

        this.createWoodTall({x: -4.2, y:1.5, z:8}, 2.5, 1.5, { x: -3.7, z: 3})
        this.createWoodTall({x: 3.7, y:1.5, z:8}, 2.5, 1.5, { x: 3.7, z: 3})
        this.createWoodTall({x: 1.7, y:1.5, z:8}, 2.5, 1.5, { x: 1.7, z: 3})
        
        this.createWoodTall({x: -4.2, y:1, z:7}, 3.5, 2, { x: -3.7, z: 7}, {x: 0, z: .7})
        this.createWoodTall({x: 4, y:1, z:5}, 3.5, 2, { x: 3.7, z: 5}, {x: 0, z: -.7})
        this.createWoodTall({x: 4, y:1, z:2}, 3.5, 2, { x: 3.7, z: 2}, {x: 0, z: .7})

        this.createWall(8, 9.5, {x:0, y: 4,z: 8.4}, 5, 'medBrick.jpg', 0, scene)
        this.createWall(8, 9.5, {x:0, y: 4,z: -3.8}, 5, 'medBrick.jpg', 0, scene)

        this.createWall(8, 12, {x:-4.6, y: 4,z: 2.5}, 5, 'medBrick.jpg', Math.PI/2, scene)
        this.createWall(8, 12, {x:4.6, y: 4,z: 2.5}, 5, 'medBrick.jpg', Math.PI/2, scene)
        
        await this.createNecessary(scene);

        const TheTable = await this.importMesh(scene, "./models/", "table.glb")
        TheTable.meshes[1].parent = null
        TheTable.meshes[1].rotationQuaternion = null
        TheTable.meshes[1].position = new Vector3(-.5,0,7.2)
        TheTable.meshes[0].dispose()
        this.putFakeShadow(TheTable.meshes[1], 5, .02)
        this.blocks.push(TheTable.meshes[1])
        let myBed
        const theBed = await this.importMesh(scene, "./models/", "medBedss.glb")
        const allBed = theBed.meshes[0].getChildren()
        allBed.forEach(bed =>{
            bed.parent = null
            if(parseInt(houseNo) === 2 && bed.name.includes('1')){
                return myBed = bed
            }
            if(bed.name.includes(`${parseInt(houseNo)+1}`)){
                myBed = bed
            }else{
                bed.dispose()
            }
        })
        if(myBed === undefined) return log("bed not found ")
        myBed.position = new Vector3(2.9,0,6.5)

        const theDoor = await this.importMesh(scene, "./models/", "smallDoor.glb")
        theDoor.meshes[0].position = new Vector3(1.9,0,-3.55)
        theDoor.meshes[0].rotationQuaternion = null

        let theCharacterRoot = await BABYLON.SceneLoader.LoadAssetContainerAsync("./models/", "gameCharac.glb", scene)
        this.myChar = this.createCharacter(this.det,theCharacterRoot,scene, shadowGen,true,true, allsword, allhelmets, allshields, light, 1.7)
        myCharDet = this.myChar
        this.myChar.bx.position = new Vector3(0,this.yPos,0)
        this.toRegAction(this.myChar.bx, myBed, () => {

            if(this.myChar.mode === "stand"){
                this.myChar.bx.locallyTranslate(new Vector3(0,0, -.12))
            }else{
                this.myChar.bx.locallyTranslate(new Vector3(0,0, -.24))
            }
        })
        this.toRegAction(this.myChar.detector, myBed, () => {
            if(isOnlyStarting) return
            this.openPopUpAction("bed")
            this.targetRecource = myBed
            this.targDetail = houseNo
        })
        this.toRegActionExit(this.myChar.detector, myBed, () => {
            this.closePopUpAction()
        })
 
        await scene.whenReadyAsync()
        this._scene.dispose()
        this._scene = scene
        
        removeHomePage()
        hideLScreen()
        openGameUI(this.det)
        this.allCanPress()
        this.camSetTarg(this.myChar.camTarg, cam, -Math.PI/2, 5);
        cam.beta = 1
        this.initPressControllers(scene)
        // this.showMapName(`${houseDet.name}`, 3000)
        await this.updatePlace(houseName)
        log(`saving place... ${houseName}`)
        
        if(isOnlyStarting){
            this.myChar.nameMesh.isVisible = false
            this.myChar.playerHealthMesh.isVisible = false
            this.targetRecource = myBed
            log("tutorial mode");
            this.closePopUpAction()
            this.stopPress()
            this.myChar._moving = false
            this.animStopAll(this.myChar, ['walk', 'running.fist', 'running.weapon'])
            apartCont.style.display = "none"
            doingCont.style.display = "block"
            doingName.innerHTML = 'Sleeping'
            cancelDoingBtn.innerHTML = 'wake up'
            closeGameUI()
            this.closePopUpAction()
            this.prevLoc = {x: Math.random()*.5, z: Math.random()*1}
            this.myChar.bx.parent = myBed
            this.myChar.mode = "onground"
            this.myChar.bx.position = new Vector3(0,1.2,0);
        }
        this.createBlock(2,180,{x: 0, z: -3.5}, 0, scene);
        this.createBlock(2,180,{x: 0, z: 8}, 0, scene);
        this.createBlock(2,190,{x: -4, z: 2}, Math.PI/2, scene);
        this.createBlock(2,190,{x: 4, z: 2}, Math.PI/2, scene);

        const toRender = () => {
            this.actionAndMovement(this.btf, this.cam)
            this.renderMonsters()
        }
        scene.registerBeforeRender(toRender);

        const pathToOutside = this.createPath(1.3,{x: 1.3, z: -3.5}, scene)
        this.toRegAction(pathToOutside, this.myChar.bx, async () => {
            this._allSounds.normalDoorOC.attachToMesh(this.myChar.bx)
            this._allSounds.normalDoorOC.play()
            this.stopPress(true)
            this.prevPlace = 'room'
            this.setUp(true)
            displayElems([apartInfos], "none")
            displayElems([aprtLoadingBx, apartCont], "flex")
            aprtLoadLabel.innerHTML = "Outside..."
            
            await this.updateMyDetailsOL({...this.det, currentPlace: 'heartland'}, false)
            showLoadingScreen(false, 'wizard')
            this.emptyArray()
            if(isInTutorialMode) this.userJoinedInitOnce()
            await this._heartLand();
        })

        window.innerHeight < 650 && this._makeJoyStick(this.socket, cam,scene, false)
        this.registerBlocks(this.myChar, .09);
    }
    async _goToGuildHouse(){
        displayElems([apartCont, aprtLoadingBx], "none")
        displayElems([apartInfos], "flex")

        showLoadingScreen(false, 'wizard')
        this.stopPress(true)
        this.setUp(false)
        const result = await this.getCharacDetailsOnline()
        this.setDetails(result)
        this.setHTMLUI(this.det)
        const scene = new Scene(this._engine);
        const gl = new BABYLON.GlowLayer("glow", scene);
        gl.intensity = 1.4
        light = new DirectionalLight("dungLight", new Vector3(0, -1, -0.3), scene);
        hemLight = new HemisphericLight("light", new Vector3(0,10,1), scene)

        scene.actionManager = new ActionManager(scene)
        scene.clearColor = new Color3(0,0,0)
        shadowGen = new ShadowGenerator(1024, light);
        this.disablePointerPicks(scene)

        this._loadCharacterSounds(scene)
        this.runLifeManaStaminaRegen()
        const cam = this.arcCam(scene)
        const btf = this.createBoxToFollow(scene)

        // const theHouse = await this.importMesh(scene, "./models/", "guildHouse.glb")
        // theHouse.meshes.forEach(mesh => mesh.receiveShadows = true)
        this.createWoodFloor(scene, 6, 6, {x:4, y:-.075 ,z:3}, {w: 35, h: 15})

        this.createWall(8, 14.5, {x:12, y: 4,z: 10.4}, 5, 'medBrick.jpg', 0, scene, true)
        this.createWall(8, 14.5, {x:-8, y: 4,z: 10.4}, 5, 'medBrick.jpg', 0, scene, true)
        this.createWall(8, 18.5, {x:10, y: 4,z: -4}, 5, 'medBrick.jpg', 0, scene, true)
        this.createWall(8, 18.5, {x:-8, y: 4,z: -4}, 5, 'medBrick.jpg', 0, scene, true)

        this.createWall(8, 18, {x:-10.6, y: 4,z: 2.5}, 5, 'medBrick.jpg', Math.PI/2, scene, true)
        this.createWall(8, 18, {x:15.6, y: 4,z: 2.5}, 5, 'medBrick.jpg', Math.PI/2, scene, true)

        const shelv = await this.importMesh(scene, "./models/", "shelves.glb", true)
        shelv.position = new Vector3(2.14,0,10);shelv.addRotation(0,Math.PI,0)

        const shelvLeft = shelv.clone('shelv2');
        shelvLeft.rotationQuaternion = null
        shelvLeft.position = new Vector3(-6,0,10)

        const shelvR = shelv.clone('shelv4');
        shelvR.rotationQuaternion = null
        shelvR.position = new Vector3(10.14,0,10)

        const shelvRight = shelv.clone('shelv3');
        shelvRight.rotationQuaternion = null
        shelvRight.position = new Vector3(-10.14,0,5)
        shelvRight.addRotation(0,-Math.PI/2,0)

        const bulletinBoard = await this.importMesh(scene, "./models/", "board.glb")
        bulletinBoard.meshes[0].position = new Vector3(0,1,9.7)

        const Book = await this.importMesh(scene, "./models/", "book.glb")
        Book.meshes[0].position = new Vector3(0,1.2,7.9);

        await this.createNecessary(scene)

        let theCharacterRoot = await BABYLON.SceneLoader.LoadAssetContainerAsync("./models/", "gameCharac.glb", scene)
        this.myChar = this.createCharacter(this.det,theCharacterRoot,scene, shadowGen,true,true, allsword, allhelmets, allshields, light, 1.7)
        myCharDet = this.myChar;
        this.myChar.bx.position = new Vector3(0,this.yPos,0);

        // GUILD MASTER
        const toWear = {cloth: 'grand', pants: 'magios', hair: 'aegon', boots: 'silver'}
        const npc = await this.createNormalNpc(scene, BABYLON, { x: 0, z: 9}, {x: 0, z: 0}, toWear)
        this.NPCs.push(npc);
        this.createNameDisplay(1.3, makeRandNum(), 'reception', npc.body, 50)

        npcInfos.forEach(npz => this.createNpc(theCharacterRoot, npz, true, btf))

        const theDesk = await this.importMesh(scene, "./models/", "guildDesk.glb")
        theDesk.meshes.forEach(mesh => {
            mesh.receiveShadows = true
        });
        theDesk.meshes[0].position.z = 8; theDesk.meshes[1].rotation = new Vector3(0,Math.PI,0)
        this.toRegAction(this.myChar.bx, theDesk.meshes[1], () => {
            this.stopPress(true)
            this.bump(this.myChar);
            setTimeout(() => this.allCanPress() ,2000)
        })
        this.toRegAction(this.myChar.detector, theDesk.meshes[1], () => {
            this.openPopUpAction("speak");
            this.targetRecource = 'guild'
            log(this.targetRecource)
            if(this.det.rank === "none") return this.targDetail = { title: "registration" }
            this.targDetail = { title: "checkquest" }
        });
        this.toRegActionExit(this.myChar.detector, theDesk.meshes[1], () => {
            this.closePopUpAction()
            guildCont.style.display = "none"
            this.targetRecource = undefined
            this.targDetail = undefined
            questCont.classList.add("trans-close")
        })

        this.createAdventurerBoard(bulletinBoard.meshes[1], {x:-10.10, y:.8, z:-1.26}, Math.PI/2)
        this.createTextMesh(makeRandNum(), 'Top Adventurers Board', 'white', {x:-9.10, y: 2.5, z:-1.26} , 40, scene, false, false)

        const theDoor = await this.importMesh(scene, "./models/", "smallDoor.glb")
        theDoor.meshes[0].position = new Vector3(1.04,0,-3.85)
        theDoor.meshes[0].rotationQuaternion = null

        await scene.whenReadyAsync()
        this._scene.dispose()
        this._scene = scene
        removeHomePage()
        hideLScreen()
        openGameUI(this.det)
        this.allCanPress()
        this.camSetTarg(this.myChar.camTarg, cam, -Math.PI/2, 5);
        cam.beta = 1;

        this.initPressControllers(scene)
        this.showMapName(`Guild House`, 3000)
        const toRender = () => {
            this.actionAndMovement(this.btf, this.cam)
            this.renderMonsters()
        }
        scene.registerBeforeRender(toRender);

        const pathToOutside = this.createPath(1,{x: 1.04, z: -4.2}, scene)
        this.toRegAction(pathToOutside, this.myChar.bx, async () => {
            this._allSounds.normalDoorOC.attachToMesh(this.myChar.bx)
            this._allSounds.normalDoorOC.play()
            this.stopPress()
            this.prevPlace = 'guildhouse'
            this.setUp(true)
            displayElems([apartInfos], "none")
            displayElems([aprtLoadingBx, apartCont], "flex")
            aprtLoadLabel.innerHTML = "Outside..."
 
            await this.updateMyDetailsOL({...this.det, x: 0,z: 52, currentPlace: 'heartland'}, false)
            showLoadingScreen(false, 'wizard')
            this.emptyArray();
            await this._heartLand()
        })
        
        window.innerHeight < 650 && this._makeJoyStick(this.socket, cam,scene, false)
        this.registerBlocks(this.myChar, .09);
        displayElems([craftIcon], "none")
        await this.updatePlace('guildhouse')
    }
    async _hl_club(){
        worldChatCont.style.display = "flex"
        const maxLoad = 2020
        showLoadingScreen(false, 'wizard', maxLoad)
        this.setUp(true);loadedMesh++

        const result = await this.getCharacDetailsOnline()
        this.setDetails(result) ; loadedMesh++
        this.setHTMLUI(this.det);
        
        const scene = new Scene(this._engine);

        scene.actionManager = new ActionManager(scene);
        this.activateGlow(1.5, scene)
        this.creationOfFakeShadow(scene)
        light = new DirectionalLight("dirLight", new Vector3(0, -1, -0.3), scene);
        light.intensity = .5

        hemLight = new HemisphericLight("light", new Vector3(0,10,2), scene)
        hemLight.intensity = .8

        shadowGen = new ShadowGenerator(1024, light);
        await this.createMugRoot(scene)
        this._loadCharacterSounds(scene)

        const cam = this.arcCam(scene)

        await this.createNecessary(scene)

        theCharacterRoot = await BABYLON.SceneLoader.LoadAssetContainerAsync("./models/", "gameCharac.glb", scene)
        const btf = this.createBoxToFollow(scene)
        this.myChar = this.createCharacter(this.det, theCharacterRoot, scene, mugMesh, false,true, allsword, allhelmets, allshields, light, 1.7)
        myCharDet = this.myChar; 
        myCharDet.bx.position = new Vector3(-1 + Math.random()*2,this.yPos,0)
        this._loadTavernSounds(scene, myCharDet.bx)
        npcInfos.forEach(npz =>this.createNpc(theCharacterRoot, npz, false, btf))
        this.runLifeManaStaminaRegen()
        this.camSetTarg(this.myChar.camTarg, cam, -Math.PI/2, 5);
    
        this.createWoodFloor(scene, 6, 6, {x:4, y:-.075 ,z:3}, {w: 35, h: 15})

        this.createWall(8, 18.5, {x:10, y: 4,z: 10.4}, 5, 'medBrick.jpg', 0, scene, true)
        this.createWall(8, 18.5, {x:-8, y: 4,z: 10.4}, 5, 'medBrick.jpg', 0, scene, true)
        this.createWall(8, 18.5, {x:10, y: 4,z: -4}, 5, 'medBrick.jpg', 0, scene, true)
        this.createWall(8, 18.5, {x:-8, y: 4,z: -4}, 5, 'medBrick.jpg', 0, scene, true)

        this.createWall(8, 18, {x:-13.6, y: 4,z: 2.5}, 5, 'medBrick.jpg', Math.PI/2, scene, true)
        this.createWall(8, 18, {x:17.6, y: 4,z: 2.5}, 5, 'medBrick.jpg', Math.PI/2, scene, true)

        const smallDoor = await this.importMesh(scene, "./models/", "smallDoor.glb", true)
        smallDoor.position = new Vector3(1.04,0,-3.7)
        smallDoor.addRotation(0,Math.PI,0)
        smallDoor.rotationQuaternion = null
        smallDoor.actionManager = new ActionManager(scene)
        this.toRegAction(smallDoor, this.myChar.bx, async () => {
            this.disposeActionM(smallDoor);
            this.disposeMeshes([smallDoor])
            this.stopPress(true)
            this.prevPlace = 'hl_club'
            this.setUp(true)
            displayElems([apartInfos], "none")
            displayElems([aprtLoadingBx, apartCont], "flex")
            aprtLoadLabel.innerHTML = "Outside..."
            this.socket.emit("dispose", {_id:this.det._id, place: this.currentPlace})
            this.det.x = 36 + Math.random()*2
            this.det.z = 10.7
            this._allSounds.normalDoorOC.play()
            showLoadingScreen(false, 'wizard')
            await this.updateMyDetailsOL({...this.det, currentPlace: 'heartland'}, false)
            this.resetMeshes()
            await this._heartLand()
        })
        const pub = await this.importMesh(scene, "./models/", "pubCounter.glb", true);
        pub.position = new Vector3(14.7,0,6.5);
        this.blocks.push(pub);
        this.toRegAction(this.myChar.detector, pub, () => {
            this.openPopUpAction("speak");
            this.targetRecource = 'drink-eat'
        });
        this.toRegActionExit(this.myChar.detector, pub, () => {
            this.closePopUpAction()
            this.targetRecource = undefined
            this.targDetail = undefined
        })  

        const tavtable = await this.importMesh(scene, "./models/", "tavernTable.glb", true);
        tavtable.position = new Vector3(14.14,0,1.75);
        this.blocks.push(tavtable)
        const tavChair = await this.importMesh(scene, "./models/", "tavChair.glb", true);
        tavChair.position = new Vector3(14.14,0,0);
        this.blocks.push(tavChair)

        const wallTorch = await this.importMesh(scene, "./models/", "wallTorch.glb", true);
        wallTorch.position = new Vector3(13,2,10.1);

        for(var i=6;i>-10;i-=4.5){
            // table
            this.createTable(tavtable, { x: i - 2 - Math.random()*.5, y: 0, z: 8.8}, Math.PI/2,
            tavChair)

            const wtorch = wallTorch.clone("wallTrch")
            wtorch.position = new Vector3(i - 2.5 - Math.random()*1,2,10.1)
            this.freeze(wtorch)
        }

        await scene.whenReadyAsync()
        this._scene.dispose()
        this._scene = scene
        this.setRightUIs(["openstatus", "mystats", "myskills", "settingsIcon"], false)
        removeHomePage()
        loadedMesh = maxLoad
        openGameUI(this.det)
        
        this.showMapName('Tavern', 3800);
        this.allCanPress()
        this.initPressControllers(scene)

        this.weJoinTheServer({x:0,z:0})
        
        hideLScreen();
        this.saveMyCurrentLoc();

        const renderThis = () => {
            this.actionAndMovement(this.btf)
        }
        scene.registerBeforeRender(renderThis) 
        window.innerHeight < 650 && this._makeJoyStick(this.socket, cam,scene, true)
        this.registerBlocks(this.myChar, .1);
        this.checkAll();
    }
    async _goToCraftHouse(){
        
        displayElems([apartCont, aprtLoadingBx], "none")
        displayElems([apartInfos], "flex")
        showLoadingScreen(false, 'wizard')
        this.stopPress(true)
        this.setUp(false)
        const result = await this.getCharacDetailsOnline()
        this.setDetails(result)
        this.setHTMLUI(this.det)
        const scene = new Scene(this._engine);
        const gl = new BABYLON.GlowLayer("glow", scene);
        gl.intensity = 1.4
        light = new DirectionalLight("dungLight", new Vector3(0, -1, -0.3), scene);
        hemLight = new HemisphericLight("light", new Vector3(0,10,1), scene)

        scene.actionManager = new ActionManager(scene)
        scene.clearColor = new Color3(0,0,0)
        shadowGen = new ShadowGenerator(1024, light);
        this.disablePointerPicks(scene)

        this._loadCharacterSounds(scene)

        this.runLifeManaStaminaRegen()
        const cam = this.arcCam(scene)
        const btf = this.createBoxToFollow(scene)
       
        await this.createWoodPlank(scene);
        const ground = this.createGround(scene, "./images/modeltex/planks.jpg", 17);
        ground.diffuseTex.uScale = 3
        ground.diffuseTex.vScale = 3

        this.createWoodTall({x: -4.2, y:1.5, z:-8.35}, 2.5, 1.5, { x: -3.7, z: 3})
        this.createWoodTall({x: 3.7, y:1.5, z:-8.35}, 2.5, 1.5, { x: 3.7, z: 3})

        this.createWoodTall({x: -4.2, y:1.5, z:8}, 2.5, 1.5, { x: -3.7, z: 3})
        this.createWoodTall({x: 3.7, y:1.5, z:8}, 2.5, 1.5, { x: 3.7, z: 3})
        this.createWoodTall({x: 1.7, y:1.5, z:8}, 2.5, 1.5, { x: 1.7, z: 3})

        this.createWall(8, 19, {x:0, y: 4,z: 8.6}, 5, 'rockTexWall.jpg', 0, scene, true)
        this.createWall(8, 19, {x:0, y: 4,z: -8.6}, 5, 'rockTexWall.jpg', 0, scene, true)

        this.createWall(8, 19, {x:-8.6, y: 4,z: 0}, 5, 'rockTexWall.jpg', Math.PI/2, scene, true)
        this.createWall(8, 19, {x:8.6, y: 4,z: 0}, 5, 'rockTexWall.jpg', Math.PI/2, scene, true)

        await this.createNecessary(scene)

        let theCharacterRoot = await BABYLON.SceneLoader.LoadAssetContainerAsync("./models/", "gameCharac.glb", scene)
        this.myChar = this.createCharacter(this.det,theCharacterRoot,scene, shadowGen,true,true, allsword, allhelmets, allshields, light, 1.7)
        myCharDet = this.myChar;
        this.myChar.bx.position = new Vector3(0,this.yPos,0);

        // npcInfos.forEach(npz => this.createNpc(theCharacterRoot, npz, true, btf))

        const theDoor = await this.importMesh(scene, "./models/", "smallDoor.glb")
        theDoor.meshes[0].position = new Vector3(1.9,0,-8.42)
        theDoor.meshes[0].rotationQuaternion = null
        this.putFakeShadow(theDoor.meshes[1], 3, .02)
        // const pathOutside = this.createPath(1.5, {x: 1.9,y:1,z:-8.42},scene)
        this.toRegAction(this.myChar.detector, theDoor.meshes[1], async () => {
            this.stopPress(true)
            this.prevPlace = 'crafthouse'
            this.setUp(true)
            displayElems([apartInfos], "none")
            displayElems([aprtLoadingBx, apartCont], "flex")
            aprtLoadLabel.innerHTML = "Outside..."
            
            await this.updateMyDetailsOL({...this.det, currentPlace: 'heartland'}, false)
            showLoadingScreen(false, 'wizard')
            this.emptyArray()
            await this._heartLand();
        })

        npcInfos.forEach(npz => this.createNpc(theCharacterRoot, npz, false, btf))

        // THE TABLE
        const smallDesk = await this.importMesh(scene, "./models/", "guildDesk.glb", true)
        smallDesk.receiveShadows = true
        smallDesk.position.z = 5.5; 
        smallDesk.rotation = new Vector3(0,Math.PI,0)
        this.blocks.push(smallDesk);

        this.toRegAction(this.myChar.detector, smallDesk, () => {
            this.openPopUpAction("speak");
            this.targetRecource = 'craft-table'
            log(this.targetRecource)            
            this.targDetail = { title: "checkquest" }
        });
        this.toRegActionExit(this.myChar.detector, smallDesk, () => {
            this.closePopUpAction()
            guildCont.style.display = "none"
            this.targetRecource = undefined
            this.targDetail = undefined
            questCont.classList.add("trans-close")
            questCont.style.display = "none"
        })

        const weaponDisplays = [
            {
                name: "normal",
                pos: {x : 1, y: 2.4, z: 8.2},
                rotateAngle: {x:0,y:0,z: Math.PI}
            },
            {
                name: "bladefury",
                pos: {x : -1.1, y: 2.4, z: 8.2},
                rotateAngle: {x:0,y:0,z: Math.PI}
            },
            {
                name: "drakfoid",
                pos: {x : -3, y: 2.4, z: 8.2},
                rotateAngle: {x:0,y:0,z: Math.PI}
            },
            {
                name: "grimblue",
                pos: {x : 2.7, y: 2.4, z: 8.2},
                rotateAngle: {x:0,y:0,z: Math.PI}
            },
            {
                name: "oakblade",
                pos: {x : 3.7, y: 2.4, z: 7.8},
                rotateAngle: {x:0,y:0,z: Math.PI}
            },

        ]
        weaponDisplays.forEach(wpn => {
            const sword1ToClone = allsword.find(swrd => swrd.name.includes(wpn.name))
            const swordDisplay = sword1ToClone.clone(wpn.name)

            swordDisplay.position = new Vector3(wpn.pos.x,wpn.pos.y,wpn.pos.z);
            swordDisplay.scaling = new Vector3(.3,.3,.3);
            const rot = wpn.rotateAngle
            swordDisplay.addRotation(rot.x,rot.y,rot.z)
        })

        await scene.whenReadyAsync()
        this._scene.dispose()
        this._scene = scene
        removeHomePage()
        hideLScreen()
        openGameUI(this.det)
        this.allCanPress()
        this.camSetTarg(this.myChar.camTarg, cam, -Math.PI/2, 5);
        cam.beta = 1;

        this.initPressControllers(scene)
        this.showMapName(`Dwarven Shop`, 3000)

        const toRender = () => {
            this.actionAndMovement(this.btf, this.cam)
            this.renderMonsters()
        }
        scene.registerBeforeRender(toRender);

        window.innerHeight < 650 && this._makeJoyStick(this.socket, cam,scene, false)
        this.registerBlocks(this.myChar, .09);
        displayElems([craftIcon], "none")
    }
    async rentOwnHouse(detail, willOwn){
        this.stopPress()

        apartInfos.style.display = "none"
        aprtLoadingBx.style.display ="block"
        this.closePopUpAction()
        if(!willOwn){
            aprtLoadLabel.innerHTML = "Renting..."
            if(detail.occupiedBy === "none"){
                log("will rent")
                this.det.coins-= parseInt(detail.rentPrice)
                const myPos = this.myChar.bx.position
                this.prevLoc = { x: myPos.x, z: myPos.z }
                await this.updateMyDetailsOL(this.det, true)
                this.socket.emit("dispose", {_id:this.det._id, place: this.currentPlace})
                await this.updatePlace(`apartment.${this.targDetail.houseNo}`)
                return await this._goToRoom(`apartment.${this.targDetail.houseNo}`)
            }
        }else{
            log("will buy the Inn")
            await this._goToRoom(detail)
        }
        
    }
    async createNecessary(scene){
        // SWORDS
        const Sword = await this.importMesh(scene, "./models/", "swords.glb")
        allsword = Sword.meshes[0].getChildren()
        allsword.forEach(swordv => {
            swordv.parent = null
            swordv.position = new Vector3(0,100,0)
        })
        this.creationOfFakeShadow(scene);
        scene.defaultMaterial.backFaceCulling = false;
        await this.createMainWings(scene)
        await this.createMainPats(scene);
        await this.creationSlash(scene)
        await this.createMagicCircle(scene)
        await this.helmetCreation(scene);
        await this.shieldCreation(scene);
        await this.buildTreazure(scene);
    }
    checkPlayers(){
        if(isLoading) return log("still loading ...")
        allUzers.forEach(player => {
            if(player._id === this.det._id) return log("This id is yours... will return !")
            const exist = this._scene.getMeshByName(`box.${player._id}`)
            if(exist) return log(`player ${player._id} player MESH already exist ! will not create`)
            this.createMessage({name: player.name, place: player.currentPlace, message: "has Joined !"})
            if(player.currentPlace !== this.currentPlace) return log("a user is in different place")
            this.createCharacter(player, theCharacterRoot, this._scene, shadowGen, false, false, allsword, allhelmets, allshields, light, 1.7)
        })
    }
    checkOrez(){
        if(isLoading) this.returnButtons
        if(ironMesh === undefined) return
        theOrez.forEach(ore => {
            if(ore.place !== this.currentPlace) return
            const alreadyHave = this.Ores.some(oree => oree.meshId === ore.meshId)
            if(alreadyHave) return log('this ORE is already created')
            this.createOre(ironMesh, ore, scene)
        })
    }
    checkTreez(){
        if(isLoading) return log("still loading ...")
        if(theTreez.length){
            theTreez.forEach(tre => {
                if(tre.place !== this.currentPlace) return
                const isMade = this.Trees.some(puno => puno.meshId === tre.meshId)
                if(!isMade){
                    this.createTree(wholeTree, tre, scene)
                }
            })
        }
    }
    checkHouzes(){
        if(isLoading) return log("still loading")
        if(!allHouses) return log("houses main mesh not ready")
        theHouzes.forEach(hous => {
            if(hous.place !== this.currentPlace) return log("house is not here")
            const isMade = houzess.some(hou => hou.meshId === hous.meshId)
            if(isMade) log("this house is made")
            if(!isMade ){
                const dPos = hous.pos.split(",")
                const hX = parseInt(dPos[0])
                const hZ = parseInt(dPos[1])
                this.createHouse(hous.meshId, hous.houseNo, allHouses[hous.houseNo], {x: hX, y:0, z:hZ}, this._scene, hZ === -30 ? Math.PI : 0, hous);
                houzess.push(hous)
            }
        })
        log(theHouzes.length)
    }
    checkMonsterz(){
        if(isLoading) return log("still loading")
        theMonz.forEach(mon => {
            if(mon.place !== this.currentPlace) return log("monster place not here")
            const isMade = Monsterz.some(monstar => monstar.monsId === mon.monsId)
            if(!isMade){
                let monsterRoot
                switch (mon.monsName) {
                    case 'goblin':
                        monsterRoot = goblinRoot
                    break;
                    case 'minotaur':
                        monsterRoot = minotaurRoot
                    break;
                    case 'viper':
                        monsterRoot = snakeRoot
                    break;
                    case 'golem':
                        monsterRoot = golemRoot
                    break;
                    case "monoloth":
                        monsterRoot = monoloth
                    break;
                    case "hellhound":
                        monsterRoot = wolfRoot
                    break;
                    case "rabbit":
                        monsterRoot = rabbit
                    break;
                }
                this.createMonster(monsterRoot, shadowGen, true, mon.monsId, mon.monsName, mon.modelType, mon.pos, mon.spd, mon.hp, mon.maxHp,mon.monsLvl, mon.atkInterval, mon.dmg, scene, mon.targHero, mon.expGain, mon.monsBreed, mon.effects)
            }
        })
    }
    checkBonFirez(){
        if(isLoading || !bonFireMesh ) return log('still loading or undefined')
        theBonFirez.forEach(mon => {
            if(mon.place !== this.currentPlace) return log("place not here")
            const isMade = bonFirezz.some(bonf => bonf.meshId === mon.meshId)
            if(!isMade){
               // create craftBonfire
               this.craftBonFire(mon.pos)
               bonFirezz.push(mon)
            }
        })
    }
    checkBedLeaves(){
        if(isLoading || !bedLeaveMesh ) return log('still loading or undefined')
        theBedLeaves.forEach(mon => {
            if(mon.place !== this.currentPlace) return log("place not here")
            const isMade = bedLeavxx.some(bonf => bonf.meshId === mon.meshId)
            if(!isMade){
               // create craftBonfire
               this.craftBedLeave(mon.pos)
               bedLeavxx.push(mon)
            }
        })
    }
    checkSeedz(){
        if(isLoading || seedMesh === undefined) return log('still loading or undeifned seed')
        theSeedz.forEach(seed => {
            const isMade = this.Seedz.some(buto => buto.meshId === seed.meshId)
            if(!isMade){
                this.createSeed(seedMesh, seed)
            }
        });
    }
    checkTreasurez( ){
        if(isLoading || treasure === undefined) return log('still loading or undeifned seed')
        if(theTreasurez.length){                
            theTreasurez.forEach(trez => {
                log("generating trasure " + trez.name)
                const isMade = this.Treasures.some(box => box.meshId === trez.meshId)
                if(!isMade) this.createTreasure(treasure, trez);
            })
        }
    }
    checkFlowers(){
        if(isLoading) return log("still loading ...")
        if(this.currentPlace === "heartland") return
        if(theFlowerz.length){
            theFlowerz.forEach(tre => {
                if(tre.place !== this.currentPlace) return log(`flower is in ${tre.place} return ...`)
                const isMade = this.AllFlowerz.some(puno => puno.meshId === tre.meshId)
                if(!isMade){
                    switch(tre.spawntype){
                        case "flowers":
                            log("it is a flower");
                            this.createFlower(stamFlower, tre, this._scene)
                        break;
                        case "herbs":
                            log("it is a HERB");
                            this.createFlower(herbleaves, tre, this._scene);
                        break
                    }
                }else{
                    log("A flower has been made")
                }
            })
        }
    }
    checkLootz(){
        log("checking theLootz")
        if(isLoading) return log("still loading ...")
        if(!allsword) return log("allsword not yet ready")
        if(theLootz.length){
            theLootz.forEach(loot => {
                log(loot)
                if(loot.place !== this.currentPlace) return log(`this loot not here`)
                const isMade = this.lootz.find(lt => lt.meshId === loot.meshId)
                if(!isMade){
                    log(`sword.${loot.meshId} not yet made so we will make`)
                    if(loot.itemType === "sword"){
                        allsword.forEach(swor => {
                            if(swor.name.split(".")[1] === loot.name){
                                log("it is drakfoid")
                                this.placeSword(loot, swor,.23, this._scene)
                            }
                        })
                    }
                }else{
                    log(`${loot.meshId} is already in the this.lootz`)
                }
            })
        }
    }
    emptyArray(){
        houzess = []
        players = []
    }
    activateSockets(allsword, Seed, treasure){
        // FROM ADMIN
        this.socket.on("time-changed", data => {
            worldTime = data.worldTime
            this.updateWorldTime(data)
        })
        this.socket.on("add-recources", data => {
            theMonz = data.monz
            theFlowerz = data.flowerz
            if(data.lootz) theLootz = data.lootz
            
            this.checkFlowers()
            this.checkMonsterz()
            this.checkLootz()
        })
        this.socket.on("receiveOre", data => {
            if(data.place !== this.currentPlace) return log("invalid place")
            this.createOre(Iron.meshes[1], data)
        })
        this.socket.on("receiveWood", data => {
            if(data.place !== this.currentPlace) return log("invalid place")
            this.createTree(wholeTree, data)
        })
        this.socket.on('putTreasure', data => {
            if(data.place !== this.currentPlace) return log("invalid place")
            this.createTreasure(treasure, data)
        })
        this.socket.on("treasure-isOpening", data => {
            this.Treasures = this.Treasures.map(tre => tre.meshId === data.meshId ? {...tre, isOpening: true, openingBy: data.openingBy} : tre)
            players.forEach(pl => {
                if(pl._id === data._id){
                    pl.mode = 'none';
                    this.keepSword(pl.rootSword, pl.rootBone);
                    const {x,z} = data.dirTarg
                    pl.position = new Vector3(data.pos.x,this.yPos,data.pos.z)
                    pl.bx.lookAt(new Vector3(x,this.yPos,z),0,0,0)
                    this.playAnim(pl.anims, 'willbow', true)
                }
            })
            log("a treasure is opening")
            log("treasurez",this.Treasures)
        })
        
        this.socket.on('dropsword', data => {
            if(data.place !== this.currentPlace) return log("not the same place")
            log(data)
            allsword.forEach(swor => {
                if(swor.name.split(".")[1] === data.name){
                    log('placing the sword ' + data.name)
                    this.placeSword(data, swor, .23, this._scene)
                }
            })
        })
        this.socket.on("s-i", detal => {
            theLootz = detal.lootz
            this.checkLootz() // wag na mag lagay ng placeSword kase eto na yon mag dodoble
            const thePlayer = players.find(pl => pl._id === detal.data._id)
            if(!thePlayer) return log("not found")
            const swordMESH = thePlayer.swordz.find(sword => sword.name.split(".")[1] === detal.data.swordData.name)
            if(!swordMESH) return log("pl sword mesh not found")
            this.struckTheSword(thePlayer, swordMESH)
        })
        // // SOCKETS CONNECTION
        this.socket.on("aUzerStopped", data => {
            if(data._id === this.det._id) return 
            players.forEach(player => {
                if(player._id === data._id){
                    const {x,z} = data.mypos
                    player._moving = false
                    player._minning = false
                    player._training = false
                    this.stopAnim(player.anims, 'walk')
                    this.stopAnim(player.anims, 'running', true)
                    player.bx.position = new Vector3(x,this.yPos,z)
                    player.bx.lookAt(new Vector3(data.dirTarg.x, player.bx.position.y, data.dirTarg.z),0,0,0)
                }
            })
        })
        this.socket.on("targetChanged", data => {
            if(data._id === this.det._id) return 
            players.forEach(player => {
                if(player._id === data._id){
                    log(player.dirTarg)
                    player.dirTarg = { x: data.dirTarg.x, z: data.dirTarg.z}
                }
            })
        })
        this.socket.on("aUzerWillDoSomething", data => {
            if(data._id === this.det._id) return 
            players.forEach(player => {
                if(player._id === data._id){
                    const {x,z} = data.mypos
                    player._moving = false
                    player._minning = false
                    player._training = false
                    this.stopAnim(player.anims, 'walk')
                    this.stopAnim(player.anims, 'running', true)
                    player.bx.position = new Vector3(x,this.yPos,z)
                    player.bx.lookAt(new Vector3(data.dirTarg.x, player.bx.position.y, data.dirTarg.z),0,0,0)
                    this.playAnim(player.anims, data.mode)
                    player.mode = data.mode
                    setTimeout(() => player.mode ="stand",data.dur)
                }
            })
        })
        this.socket.on("aMechMove", data => { 
            if(data._id === this.det._id) return
            players.forEach(player => {
                if(player._id === data._id){
                    player.mode = data.mode
                    player._attacking = false
                    player._moving = true
                    player.dirTarg = data.dirTarg
                }
            })
        })
        this.socket.on("changedMode", data => {
            if(data._id === this.det._id) return
            let toAnim = ''
            players.forEach(player => {
                if(player._id === data._id){
                    switch(data.mode){
                        case "stand":
                            if(player.mode === 'weapon') toAnim = 'tostand'
                        break;
                        case "weapon":
                            player.drawSwordS.play(.25)
                            if(player.mode === 'stand') toAnim = 'willfight'
                            if(player.mode === 'fist') toAnim = 'willfight'
                        break;
                    }
                    this.playAnim(player.anims, toAnim)
                    setTimeout(() => {
                        player.mode = data.mode
                        this.setPlayerMode(player)
                    }, 350)
                }
            })
        })
        
        // ACTIONS SOCKET
        this.socket.on("user-iscasting", data => {
            if(data.place !== this.currentPlace) return log("someone cast skill from diff place")
            const skillRecord = skills.find(skl => skl.name === data.skillName)
            players.forEach(player => {
                if(player._id === data._id) {
                    log("A player will cast a skill")
                    this.skillIntro(skillRecord, player)
                }
            })
            
        })
        this.socket.on("w-d-s", data => {
            const thePlayer = players.find(pl => pl._id === data._id)
            if(!thePlayer) return log("pl not found")
            thePlayer.mode = "none"
            this.getSword(thePlayer.rootSword, thePlayer.rHand)
            this.playAnim(thePlayer.anims, "willStruck")
            thePlayer.rootSword.addRotation(Math.PI,0,0)
        })
        this.socket.on("user-cast", data => {
            const {skillName, prevMode, place, elemColor, phyDmg, magDmg, inFrontPos} = data
            if(place !== this.currentPlace) return log("someone cast skill from diff place")
            players.forEach(player => {
                if(player._id === data._id) {
                    log("A player cast skill")
                    player.mode = "none";
                    player._casting = true;
                    this.initiateSkill(skillName, player, phyDmg, magDmg, elemColor, inFrontPos, data.skillDmg, prevMode)
                }
            })
        })
        this.socket.on("userAttack", data => {
            if(data._id === this.det._id) return
            players.forEach(player => {
                if(player._id === data._id) {
                    player._moving = false 
                    player._attacking = true             
                    player.mode = data.mode
                    player.bx.lookAt(new Vector3(data.dirTarg.x, player.bx.position.y,data.dirTarg.z),0,0,0)                    
                    player.whoopS.setPlaybackRate(.8)
                    player.whoopS.play(.3)
                    this.setPlayerMode(player)
                    this.stopAnim(player.anims, data.animName)
                    this.playAnim(player.anims, data.animName)

                    setTimeout(() => {
                        player._attacking = false
                    }, 500)
                }
            })
        })
        this.socket.on("user-throw", data => {
            const thePlayer = players.find(pl => pl._id === data._id)
            if(!thePlayer) return log("player not found")
            if(data.curPlace !== this.currentPlace) return log("the Spear thrown is not from here")
            const curSword = thePlayer.swordz.find(swrd => swrd.name.split(".")[1] === data.weaponDetail.name)
            if(!curSword) return log("cur sword not found")
            
            this.createFlyingWeapon(data.myFosNow, data.dmg, data.mode, curSword, data.frontPos, data.dirTa, data.weaponDetail, data._id)
            this.hideAllSword(thePlayer.swordz)
            this.keepSword(thePlayer.rootSword, thePlayer.rootBone)
        })
        this.socket.on("action-throwing", data => {
            if(data._id !== this.det._id){
                log("a hero will throw")
                const theFleyer = players.find(pl => pl._id === data._id)
                if(!theFleyer) return log('player throwing not found')
                let plCurSword
                players.forEach(pl => {
                    if(pl._id === data._id){
                        plCurSword = pl.swordz.find(swrd => swrd.name.split(".")[1] === data.weaponName)
                        if(plCurSword) plCurSword.addRotation(Math.PI,0,0)
                        pl.mode = "noneweapon"
                        pl._attacking = true
                        this.stopAnim(pl.anims, "running", true)
                        this.playAnim(pl.anims, "throw")
                    }
                })
                log(theFleyer.mode)
                setTimeout(() => {
                    players.forEach(pl => {
                        if(pl._id === data._id){
                            pl.mode = "fist"
                            pl._attacking = false
                        }
                    })
                    if(plCurSword) plCurSword.addRotation(-Math.PI,0,0)
                }, 500)
            }
        })
        this.socket.on("userIsMinning", data => {
            if(data._id === this.det._id) return
            players.forEach(player => {
                if(player._id === data._id) {
                    player.mode = 'stand'
                    this.getSword(player.rootSword, player.rHand)
                    player._minning = true
                    player.bx.position = new Vector3(data.pos.x,this.yPos,data.pos.z)
                }
            })
        })
        this.socket.on("userIsTraining", data => {
            if(data._id === this.det._id) return

            players.forEach(player => {
                if(player._id === data._id) {
                    player.mode = 'stand'
                    this.setPlayerMode(player)
                    player._training = true
                    player.bx.position = new Vector3(data.pos.x,this.yPos,data.pos.z)
                    player.bx.lookAt(new Vector3(data.dirTarg.x, this.yPos, data.dirTarg.z),0,0,0)
                }
            })
        })
        this.socket.on("aUserBumped", data => {
            const thePlayer = players.find(pl => pl._id === data._id)
            if(thePlayer){
                this.animStopAll(thePlayer)
                this.stopAnim(thePlayer.anims, "running")
                this.stopAnim(thePlayer.anims, "walk")

                this.bump(thePlayer)
                this.playerLookAt(thePlayer.bx, data.dirTarg)
                thePlayer.bx.position = new Vector3(data.pos.x,thePlayer.bx.position.y,data.pos.z)
            }
        })
        // ABOUT RECOURCES
        this.socket.on("oreDeducted", data => {
            if(data.place !== this.currentPlace) return log("diff place")
            this.Ores = this.Ores.map(oree => oree.meshId === data.meshId ? {...oree, hits: oree.hits-1} : oree)
            const theIron = this.Ores.find(oree => oree.meshId === data.meshId)
            if(!theIron) return log("not found")
            if(theIron.hits <= 0){
                if(data._id === this.det._id) this.myChar._minning = false
                players.forEach(player => {
                    if(player._id === data._id) player._minning = false
                })
                theIron.body.position.y = 200
                theIron.body.dispose(false, false)
                this.Ores = this.Ores.filter(oree => oree.meshId !== data.meshId)
                return
            }
        })
        this.socket.on("treeDeducted", data => {
            if(data.place !== this.currentPlace) return log("diff place")
            this.Trees = this.Trees.map(oree => oree.meshId === data.meshId ? {...oree, hits: oree.hits-1} : oree)
            const theTree = this.Trees.find(oree => oree.meshId === data.meshId)
            if(!theTree) return log("not found")
            if(theTree.hits <= 0){
                if(data._id === this.det._id) this.myChar._training = false
                players.forEach(player => {
                    if(player._id === data._id) player._training = false
                })
                theTree.body.dispose()
                this.Trees = this.Trees.filter(oree => oree.meshId !== data.meshId)
                return
            }
        })
        this.socket.on("treasure-removed", data => {
            log(data)
            log('treasure need to removed')
            log(this.Treasures)
            const theTreasure = this.Treasures.find(tre => tre.meshId === data.meshId)
            if(theTreasure){
                theTreasure.body.dispose()
                this.Treasures = this.Treasures.filter(tre => tre.meshId !== data.meshId)
                log("a treasure has been disposed")
            }
        })
        this.socket.on("userWillPlant", data => {
            if(data.place === this.currentPlace){
                players.forEach(player => {
                    if(player._id === data._id){
                        player.mode = "none"
                        this.playAnim(player.anims, "plantseed")
                        player.bx.lookAt(new Vector3(data.dirTarg.x, this.yPos, data.dirTarg.z),0,0,0)
                        setTimeout(() => player.mode = "stand", 2000)
                    }
                })
                this.createSeed(Seed, data)
            }
        })
        this.socket.on("bonfire-crafted", allbonzfire => {
            log("someone craft bonfire")
            theBonFirez = allbonzfire
            this.checkBonFirez()
        })
        this.socket.on("bedleave-crafted", allbonzfire => {
            log("someone craft bedleave")
            theBedLeaves = allbonzfire
            this.checkBedLeaves()
        })
        this.socket.on("check-monsdied", data => {
            if(data.place !== this.currentPlace) return
            const theMons = Monsterz.find(mons => mons.monsId === data.monsId)
            if(!theMons) return log("monster maybe already removed");

            log("there is one monster that died on other client")
            clearTimeout(theMons.intervalWillAttack)
            this.stopAnim(theMons.anims, 'hit', true);
            this.monsterDied(data.monsId)

            this.removeToBash({_id: data.monsId})
            Monsterz = Monsterz.filter(mons => mons.monsId !== data.monsId);
        })
        this.socket.on("monsterGotHit", data => {
            const { detal, theMonsterHP } = data
            log("hp of monster from server " + theMonsterHP)
            const theMons = Monsterz.find(mons => mons.monsId === detal.monsId)
            if(!theMons) return log("not found monster");
            log(`I damaged the ${theMons.monsName}`)
            if(Math.random() > .5){
                switch(theMons.monsName){
                    case "goblin":
                        theMons.monsSoundHit.setPlaybackRate(.9 + Math.random()*.3)
                        theMons.monsSoundHit.play(0,Math.random() > .5 ? .4 : 0)        
                    break
                    case "minotaur":
                        theMons.monsSoundHit.setPlaybackRate(.9 + Math.random()*.3)
                        theMons.monsSoundHit.play()        
                    break
                }
            }
            
            this.monsterIsHit(detal.monsId, {x: detal.mypos.x, z: detal.mypos.z}, detal._id, detal.dmgTaken, detal.pos, detal.mode, detal.isCritical)
            theMons.hp = theMonsterHP
            theMons.robHealthGui.width = `${(parseInt(theMons.hp)/parseInt(theMons.maxHp) * 100) * 4}px`;
        })
        this.socket.on("monsIsChasing", data => {
            Monsterz.forEach(mons => {
                if(mons.monsId === data.monsId){
                    clearInterval(mons.intervalWillAttack)
                    mons.isAttacking = false
                    mons.targHero = data.targHero
                    mons.isChasing = true
                }
            })
        })
        this.socket.on("monsStopped", data => {
            const theMons = Monsterz.find(mons => mons.monsId === data.monsId)
            if(!theMons) return log("cannot attack undefined monster")
            Monsterz = Monsterz.map(mon => mon.monsId === data.monsId ? {...mon, isChasing: false, isAttacking: false, targHero: undefined} : mon)
            theMons.body.position = new Vector3(data.pos.x, theMons.body.position.y, data.pos.z)
        })
        this.socket.on("monsAttack", data => {
            const { detal, theMonsterHP } = data
            const theMons = Monsterz.find(mons => mons.monsId === detal.monsId)
            if(!theMons) return log("cannot attack undefined monster from TCP server")
            theMons.isChasing = false
            theMons.isAttacking = true

            const theTargeIsHere = this._scene.getMeshByName(`box.${theMons.targHero}`)
            if(!theTargeIsHere){
                theMons.isChasing = false
                theMons.isAttacking = false
                theMons.targHero = undefined
                log("targ not here")
            }else{
                this.monsterAttack(theMons.monsId, theMons.monsName, detal.pos, theMons.targHero, detal.animaName)
            }
            theMons.hp = theMonsterHP
            theMons.robHealthGui.width = `${(parseInt(theMons.hp)/parseInt(theMons.maxHp) * 100) * 4}px`;
        })
        this.socket.on("mons-thrown", data => {
            
            const theMons = Monsterz.find(mons => mons.monsId === data.monsId)
            if(!theMons) return log("cannot attack undefined monster from TCP server")
            const theTargPlayer = players.find(pl => pl._id === data.playerId)
            if(!theTargPlayer) return log("throw to player not found")
            this.initMonsterThrow(data.monsId, theTargPlayer, data.dmg)
        })
        this.socket.on("playerHitted", data => {
            const thePl = players.find(pl => pl._id === data._id)
            if(!thePl) return log("the player that will be hit not found !")
            if(this.det._id === data._id) return log("me is hit by me ?? return now")
            const theMons = Monsterz.find(mons => mons.monsId === data.monsId)
            if(!theMons) return log("monster attacking not found")
            players.forEach(player => {
                if(player._id === data._id){
                    const bdpos = theMons.body.position
                    player.bx.lookAt(new Vector3(bdpos.x,this.yPos, bdpos.z),0,0,0)
                    this.playAnim(player.anims, data.animName)
                    log(player.name + ' is hit by monster!')
                }
            })
        })
        this.socket.on("reclosedTreasure", meshId => {
            this.Treasures = this.Treasures.map(tre => tre.meshId === meshId ? {...tre, openingBy: undefined, isOpening: false} : tre)
            log("close treasure")
            log(meshId)
            log('treasurez', this.Treasures)
        })
        this.socket.on("hitByHero", data => {
            const thePlayer = players.find(pl => pl._id === data.targHero)
            const personpos = thePlayer.bx.position
            this.createBloodParticle("blood", 200, {x: personpos.x, y:personpos.y+Math.random()*.5,z:personpos.z}, "sphere", true, 1, true, false)
            if(data.targHero == this.det._id){
                clearTimeout(this._attackTimeout) // para di mag timeout keypress all
                this.myChar.weaponCol.position.y = 4.5
                this.stopPress()
                this.myChar.anims.forEach(anim => anim.stop())
                this.myChar._moving = false

                if(this.myLoadingBarMin > 0){ //IF OPENING A TREASURE                
                    clearInterval(this.intervalUntilFull)
                    this.myLoadingBarMin = 0
                    log("is opening treasure stoped");           
                    this.stopAnim(this.myChar.anims, 'willbow')
                    this.myBar.barMesh.isVisible = false
                    clearInterval(this.intervalUntilFull)
                    this.myBar.bar.width = `0px`
                    this.allCanPress();
                    this.myChar.mode = "fist"
                    this.keepSword(this.myChar.rootSword, this.myChar.rootBone)
                    log("when hit while opening treasure automatik canPressAll")
                    log("I am hit while opening a treasure")
                    this.socketAvailable && this.socket.emit('reclose-treasure', this.targDetail.meshId)
                }
                const curMode = this.myChar.mode
                this.myChar.mode = "none";
                clearTimeout(this._attackTimeout)
                this.hitByHero(this.myChar, data)
                const myDef = this.recalPhyDefense(data.dmgTaken)
                let toDeduct = myDef >= data.dmgTaken ? 1 : data.dmgTaken
                this.det.hp-=toDeduct;
                this.updateLifeManaSpGUI()
                this.updateLifeMesh(this.myChar, {hp: this.det.hp,maxHp:this.det.maxHp})
                log('remaining HP ' + this.det.hp)
                // this will show my life in public except from me because I'm updating my life here no need to update tice in their's
                this.socket.emit("showDeductLifeInPublic", {_id: this.det._id, hp: this.det.hp, maxHp: this.det.maxHp})
                if(this.det.hp <=0){
                    log('game over')
                    this.myChar.mode = "none";
                    this.stopMyCharacter()
                    this.playerDeath(this.myChar)
                    this.socket.emit('playerDied', {_id: this.det._id, killer: data._id})
                    setTimeout(() => {
                        this.socket.emit("dispose", {_id:this.det._id, place: this.currentPlace})
                    }, 10000)
                    return this.gameOver()
                }
                this._attackTimeout = setTimeout(() => {
                    this.allCanPress()
                    this.myChar.mode = curMode
                }, 500)
                log("I am hit by a hero updating life")
            }else{
                if(!thePlayer) return log("player that is hit not here")
                log(thePlayer.name + " got hit")
                this.hitByHero(thePlayer, data)        
                this.animStopAll(thePlayer, ['running', 'walking', 'walk', 'slash.1']) 
            }
        })
        this.socket.on("deductLifeInMesh", data => {
            if(data._id === this.det._id) return log("this is mine no need to deduct mesh life")
            log('deduct life of this hero')
            const thePlayer = players.find(pl => pl._id === data._id)
            if(!thePlayer) return log("not found")
            log(thePlayer.name + ' life will be deducted')
            this.updateLifeMesh(thePlayer, data)
        })
        this.socket.on("aUserDied", data => {
            if(data._id === this.det._id) return log("I died already return")      
            if(data.killer) { 
                if(data.killer === this.det._id){
                    log("the killer is me")
                    this.focusOn = null
                }
            }            
            const thePlayer = players.find(pla => pla._id === data._id)
            log(`A User Died `)

            if(!thePlayer){
                log("dead character not found maybe because this is us so no record in players")
            }else{
                this.playerDeath(thePlayer)
                thePlayer.playerHealthMesh.dispose()
                thePlayer.nameMesh.dispose()
                players = players.filter(pla => pla._id !== data._id)          
            }
            Monsterz.forEach(mons => {
                if(mons.targHero === data._id){
                    clearInterval(mons.intervalWillAttack)
                    mons.isChasing = false
                    mons.isAttacking = false
                    mons.targHero = undefined
                }
            })
            this.enemyRegistered = this.enemyRegistered.filter(enemId => enemId !== data._id)

        })

        this.socket.on("swordhide", data => {
            players.forEach(player => {
                if(player._id === data._id){
                    player.swordz.forEach(swrd =>swrd.isVisible = false)
                }                
            })
        })
        this.socket.on("aUserEquipSword", data => {
            if(data._id === this.det._id) return log("my character return")
            players.forEach(player => {
                
                if(player._id === data._id){
                    
                    const isHave = player.swordz.some(swrd => swrd.name.split(".")[1] === data.swordDetail.name)
                    if(!isHave){
                        const updatedSwordz = player.createSword(data.swordDetail.name)
                        player.swordz = updatedSwordz
                        log("A player sword creation is complete !")
                        log(`player swordz updated `, player.swordz)
                    }
                    this.makeSwordVisible(player.swordz, data.swordDetail.name)
                }                
            })
        })
        this.socket.on("aUserEquipArmor", data => {
            log(data.armorDetail.name)
            players.forEach(player => {
                if(player._id === data._id){
                    this.makeSwordVisible(player.armorz, data.armorDetail.name)
                }                
            })
        })
        this.socket.on("aUserEquipGear", data => {
            log(data.itemDetail.name)
            players.forEach(player => {
                if(player._id === data._id){
                    this.makeSwordVisible(player.gearz, data.itemDetail.name)
                }                
            })
        })
        this.socket.on("aUserEquipShield", data => {
            if(data._id === this.det._id) return log("my character return")
            players.forEach(player => {
                if(player._id === data._id){
                    const isHave = player.myshieldz.some(swrd => swrd.name.split(".")[1] === data.itemDetail.name)
                    if(!isHave){
                        const updatedShieldz = player.createShield(data.itemDetail.name)
                        player.myshieldz = updatedShieldz
                        log(`player shield created new & updated `, player.myshieldz)
                    }
                    this.makeSwordVisible(player.myshieldz, data.itemDetail.name)
                }                
            })
        })
        this.socket.on("aUserEquipHelmet", data => {
            if(data._id === this.det._id) return log("my character return")
            players.forEach(player => {
                if(player._id === data._id){
                    const isHave = player.myhelmetz.some(swrd => swrd.name.split(".")[1] === data.itemDetail.name)
                    if(!isHave){
                        const updatedHelmetz = player.createHelm(data.itemDetail.name)
                        player.myhelmetz = updatedHelmetz
                        log(`player helmet created new & updated `, player.myhelmetz)
                    }
                    this.makeSwordVisible(player.myhelmetz, data.itemDetail.name)
                }                
            })
        })
        this.socket.on("aUserUnEquiped", data => {
            if(data._id === this.det._id) return log("my character return")
            players.forEach(player => {
                if(player._id === data._id){
                    switch(data.itemType){
                        case "armor":
                            this.hideMesh(player.armorz, data.itemName)
                        break;
                        case "gear":
                            this.hideMesh(player.gearz, data.itemName)
                        break;
                        case "helmet":
                            this.hideMesh(player.myhelmetz, data.itemName)
                        break;
                        case "shield":
                            this.hideMesh(player.myshieldz, data.itemName)
                        break;
                        case "sword":
                            this.hideMesh(player.swordz, data.itemName)
                        break;
                    }
                    
                }                
            })
        })
        this.socket.on("swordIsPicked", data => {            
            log(data)
            if(data.place !== this.currentPlace) return log('place not the same')
            this.lootz = this.lootz.filter(lot => lot.meshId !== data.meshId);
            theLootz = theLootz.filter(lot => lot.meshId !== data.meshId);
            
            let disposingSword = []
            this._scene.meshes.forEach(mes => {
                if(mes.name.includes("sword")){
                    if(mes.name.split(".")[1] === data.meshId)disposingSword.push(mes)
                }
            })
            log(`disposing sword `, disposingSword)
            disposingSword.forEach(dmesh => {
                dmesh.isVisible = false
                dmesh.dispose()
                if(dmesh.actionManager){
                    log("mesh sword have action manager")
                    dmesh.actionManager.dispose()
                    dmesh.actionManager = undefined
                }
            })
            log(`updated lootz `, this.lootz)
        })
        this.socket.on("flowerIsPicked", data => {            
            const theFlower = this._scene.getMeshByName(`flower.${data.meshId}`)
            if(!theFlower) return log("flower not here");
            this.AllFlowerz = this.AllFlowerz.filter(flwr => flwr.meshId !== data.meshId);
            log(this.AllFlowerz);
            theFlower.position.y = 100;
            theFlower.dispose()
            log("flower is disposed")
        })
        this.socket.on("shownSwordLength", playrId => {
            players.forEach(pl => pl._id === playrId && log(pl.swordz.length))
        })
        this.socket.on('sentto-world', data => {        
            this.createMessage(data)
        })
        // disconnections
        this.socket.on('removeChar', data => {
            this.removeAChar(data)

        })
        this.socket.on("aUserDisconnect", uzerid => {
            players = players.filter(pl => pl._id !== uzerid)
            const bodyOfUser = this._scene.getMeshByName(`box.${uzerid}`)
            if(!bodyOfUser) return log("player quit Mesh toDispose Not found")
            bodyOfUser.dispose()
            Monsterz.forEach(mons => {
                if(mons.targHero === uzerid){
                    mons.targHero = undefined
                    mons.isChasing = false
                    mons.isAttacking = false
                }
            })
            this.Treasures.forEach(tre => {
                if(tre.openingBy === uzerid){
                    tre.isOpening = false
                    tre.openingBy = undefined
                }
            })
            this.enemyRegistered = this.enemyRegistered.filter(enemId => enemId !== uzerid)
            log(uzerid + " is disconnected from the game")
            this.countActivePl()
        })
    }
    renderMonsters(){
        Monsterz.forEach(mons => {
            if(mons.isChasing && !mons.isHit){
                const toChase = this._scene.getMeshByName(`box.${mons.targHero}`)
                if(toChase){
                    mons.body.lookAt(new Vector3(toChase.position.x,mons.body.position.y,toChase.position.z),0,0,0)
                    this.playAnim(mons.anims, "running")
                    mons.body.locallyTranslate(new Vector3(0,0,mons.spd * (this._engine.getDeltaTime()/1000)))
                }
            }
            if(mons.monsName !== 'slime') mons.weapon.position.y += .1
        })
    }
    actionAndMovement(btf){
        // if(this.camZoomingOut){
        //     if(this.cam.radius < 15.08){
        //         this.cam.radius += .2
        //     }else{
        //         this.camZoomingOut = false
        //     }
        // }
        if(this.camZoomingIn && this.cam){
            this.cam.radius-=.7
        }
        this.myChar.weaponCol.locallyTranslate(new Vector3(0,.3,0))        

        players.forEach(playerDet => {
            if(playerDet._moving){
                playerDet._minning = false
                playerDet._training = false
                playerDet._attacking = false
                if(playerDet._id === this.det._id){
                    this.btf.locallyTranslate(new Vector3(moveNums.leftRight * 5,0,moveNums.straight * 5))
                    const btfPos = this.btf.position
                    playerDet.dirTarg = {x: btfPos.x,z: btfPos.z}
                }
                playerDet.bx.lookAt(new Vector3(playerDet.dirTarg.x,playerDet.bx.position.y,playerDet.dirTarg.z))
                switch(playerDet.mode){
                    case "stand":
                        playerDet.bx.locallyTranslate(new Vector3(0,0,this.walkSpeed * (this._engine.getDeltaTime()/1000) ))
                        playerDet.moveActionName = 'walk'
                    break;
                    case "weapon":
                                             
                        playerDet.bx.locallyTranslate(new Vector3(0,0,playerDet.spd * (this._engine.getDeltaTime()/1000) ))
                        playerDet.moveActionName = `running.${playerDet.mode}`
                        playerDet.myshieldz.forEach(mesh => mesh.position.x = -.5)                         
                    break;
                    case "fist":                      
                        playerDet.bx.locallyTranslate(new Vector3(0,0,playerDet.spd * (this._engine.getDeltaTime()/1000) ))
                        playerDet.moveActionName = `running.${playerDet.mode}` 
                        playerDet.myshieldz.forEach(mesh => mesh.position.x = -.5)                        
                    break;
                }
                this.playAnim(playerDet.anims, playerDet.moveActionName)
            }else if(
            !playerDet._moving 
            && !playerDet._attacking
            && !playerDet._training
            && !playerDet._minning
            ){                
                switch(playerDet.mode){
                    case 'stand':
                        this.playAnim(playerDet.anims, '0Idle');
                        playerDet.myshieldz.forEach(mesh => mesh.position.x = 0)
                    break;
                    case "onground":
                        this.playAnim(playerDet.anims, 'onground')
                    break;
                    case "lookaround":
                        this.playAnim(playerDet.anims, 'lookaround')
                    break;
                    case "weapon":
                        this.playAnim(playerDet.anims, 'fight.idle')
                        playerDet.myshieldz.forEach(mesh => mesh.position.x = 0)
                    break
                    case "fist":
                        this.playAnim(playerDet.anims, 'fight.idle');
                        playerDet.myshieldz.forEach(mesh => mesh.position.x = 0)
                    break;
                    case "sitting":
                        this.playAnim(playerDet.anims, 'sitting');
                    break;
                    case "poisoned":
                        this.playAnim(playerDet.anims, 'tired.idle');
                    break;
                }
            }
            if(playerDet._minning){
                this.playAnim(playerDet.anims, "minning")
            }
            if(playerDet._training){
                this.playAnim(playerDet.anims, "slash.1")
                this.getSword(playerDet.rootSword, playerDet.rHand)
            }
        })

        demons.forEach(playerDet => {
            if(playerDet._moving && playerDet.targHero){
                const target = this._scene.getMeshByName(`box.${playerDet.targHero}`)
                if(target){
                    log('there is target')
                    this.playerLookAt(playerDet.bx, target.getAbsolutePosition())
                }
                switch(playerDet.mode){
                    case "stand":
                        playerDet.bx.locallyTranslate(new Vector3(0,0,this.walkSpeed * (this._engine.getDeltaTime()/1000) ))
                        playerDet.moveActionName = `walk`
                    break;
                    case "weapon":
                                             
                        playerDet.bx.locallyTranslate(new Vector3(0,0,playerDet.spd * (this._engine.getDeltaTime()/1000) ))
                        playerDet.moveActionName = `running.${playerDet.mode}`
                        
                    break;
                    case "fist":                      
                        playerDet.bx.locallyTranslate(new Vector3(0,0,playerDet.spd * (this._engine.getDeltaTime()/1000) ))
                        playerDet.moveActionName = `running.${playerDet.mode}` 
                        
                    break;
                }
                this.playAnim(playerDet.anims, playerDet.moveActionName)
            }else if(!playerDet._moving && !playerDet._attacking){                
                switch(playerDet.mode){
                    case 'stand':
                        this.playAnim(playerDet.anims, '0Idle');
                        
                    break;
                    case "onground":
                        this.playAnim(playerDet.anims, 'onground')
                    break;
                    case "lookaround":
                        this.playAnim(playerDet.anims, 'lookaround')
                    break;
                    case "weapon":
                        this.playAnim(playerDet.anims, 'fight.idle')
                        
                    break
                    case "fist":
                        this.playAnim(playerDet.anims, 'fight.idle');
                        
                    break;
                }
            }
        })
        if(botMoving){
            log("botmoving is true")
            clearInterval(this.hitRecourceInterval)
            this.myChar._minning = false
            this.myChar._training = false
    
            const {x,z} = this.myChar.bx.getAbsolutePosition()
            // bx.position = new Vector3(x + xcor, bx.position.y, z + zcor)
            btf.locallyTranslate(new Vector3(xcor,0,zcor))
            this.myChar.bx.lookAt(new Vector3(btf.position.x,this.myChar.bx.position.y,btf.position.z),0,0,0)

            const bxAbsPos = btf.getAbsolutePosition()
            bodyx = bxAbsPos.x// bx pos too lookat
            bodyz = bxAbsPos.z // bx pos too lookat
            curPos = {x,z} // my bod pos

            switch(this.myChar.mode){
                case "stand":
                    this.myChar.bx.locallyTranslate(new Vector3(0,0,this.walkSpeed*(this._engine.getDeltaTime()/1000) ))
                    this.moveActionName = "walk"
                break;
                case "weapon":
                    this.myChar.bx.locallyTranslate(new Vector3(0,0,this.runSpeed*(this._engine.getDeltaTime()/1000) ))
                    this.moveActionName = `running.${this.myChar.mode}`
                    this.myChar.myshieldz.forEach(mesh => mesh.position.x = -1)
                break;
                case "fist":
                    this.myChar.bx.locallyTranslate(new Vector3(0,0,this.runSpeed*(this._engine.getDeltaTime()/1000) ))
                    this.moveActionName = `running.${this.myChar.mode}`
                    this.myChar.myshieldz.forEach(mesh => mesh.position.x = -1)
                break;
            }
            this.playAnim(this.myChar.anims, this.moveActionName, true)
        }
        if(this.floatingMeshes.length) this.floatingMeshes.forEach(meshDet => meshDet.mesh.position.y += .075)
        
        this.allScaling.forEach(scalingM => {
            scalingM.mesh.scaling.x += scalingM.spd
            // scalingM.mesh.scaling.y += scalingM.spd
            scalingM.mesh.scaling.z += scalingM.spd
        })
        this.allRotating.forEach(rotatingM => {
            rotatingM.mesh.addRotation(0,!rotatingM.isForward ? rotatingM.spd : 0,rotatingM.isForward ? rotatingM.spd : 0)
        })
        this.allVanishing.forEach(vanishM => {
            vanishM.mesh.visibility -= vanishM.spd
        })
        this.flyingWeaponz.forEach(weapnz => {
            if(weapnz.mesh.name === "sharpRock"){
                weapnz.mesh.locallyTranslate(new Vector3(0,28*(this._engine.getDeltaTime()/1000),0))
            }else{
                weapnz.mesh.locallyTranslate(new Vector3(0,0,weapnz.spd ? weapnz.spd * (this._engine.getDeltaTime()/1000) : 20*(this._engine.getDeltaTime()/1000)))
            }
            
        })
        // all bashed will be put here
        this.bashed.forEach(det => {
            det.mesh.locallyTranslate(new Vector3(0,0,-det.bashPower*(this._engine.getDeltaTime()/1000)))
        })
        
        simpleNpc.forEach(npz => {
            if(npz._moving){
                this.playAnim(npz.anims, "walk")
                npz.bx.locallyTranslate(new Vector3(0,0,this.npcWalkSpd * (this._engine.getDeltaTime()/1000) ))
            }
        })
    }
    stopMoving(){
        this.myChar._moving = false

        this.stopAnim(this.myChar.anims, "running", true)
        this.stopAnim(this.myChar.anims, "walk", true)
        myCharDet.runningS.stop()
        const toEmit = {
            dirTarg: { x: this.btf.position.x, z: this.btf.position.z},
            _id: this.det._id,
            mypos: {x: this.myChar.bx.position.x, z: this.myChar.bx.position.z}
        }        
        this.socketAvailable && this.socket.emit("stop", toEmit)
        clearTimeout(this.savingTimeout)
        this.savingTimeout = setTimeout( async () => {
            try {                
                await this.useFetch(`${APIURL}/characters/updateloc/${this.det._id}`, "PATCH", this.token, {mypos: toEmit.mypos, survival: this.det.survival})   
            } catch (error) {
                log(error)
            }
        }, 1000) 
    }
    initPressControllers(scene){
        // scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, e => {

        // }))
        // scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, e => {

        // }))
        let btfRadius = 5
        const resetBtfLookAndPos = () => {
            const {x,z} = this.myChar.bx.position
            this.btf.position = new Vector3(x,this.yPos,z)
            const camD = this.cam.getForwardRay().direction
            const toLook = this.btf.position.add(new Vector3(camD.x,0,camD.z))
            this.btf.lookAt(new Vector3(toLook.x,this.btf.position.y,toLook.z),0,0,0) // will only look will not advance forward
        }
        document.addEventListener("keydown", e => {
            
            if(!this._canpress || this.det.hp <=0) return log("canpress false")
            const keyPressed = e.key.toLowerCase()
            const me = players.find(pl => pl._id === this.det._id)
            if(!me) return log("not found myself")
            
            const moveFunc = () => {
                
                if(!this.myChar._moving) clearInterval(this.hitRecourceInterval)
                resetBtfLookAndPos()
                
                switch(this.myChar.mode){
                    case "weapon":
                        
                        this.myChar.moveActionName = 'running.weapon'
                         if(!myCharDet.runningS.isPlaying) myCharDet.runningS.play(0)
                    break;
                    case "fist":
                        this.setRunningSound()
                        this.myChar.moveActionName = 'running.fist'
                         if(!myCharDet.runningS.isPlaying) myCharDet.runningS.play()
                    break;
                    case "stand":
                        
                        // myCharDet.runningS.setPlaybackRate(1)
                        if(!myCharDet.runningS.isPlaying) myCharDet.runningS.play()
                    break
                }
            }
            const sendToSocket = () => {                
                this.socketAvailable && this.socket.emit("move", {
                    dirTarg: { x: this.btf.position.x, z: this.btf.position.z},
                    _id: this.det._id,
                    mode: this.myChar.mode
                })
            }
            switch(keyPressed){
                case "w":
                    moveFunc()

                    moveNums.straight = 0
                    moveNums.straight = 1
                    this.btf.locallyTranslate(new Vector3(moveNums.leftRight * btfRadius,0,moveNums.straight * btfRadius))
                    this.myChar._moving = true
                    // this.btf.locallyTranslate(new Vector3(0,0,this.runSpeed + 100))
                    sendToSocket()
                break
                case "a":
                    moveFunc()
  
                    moveNums.leftRight = 0
                    moveNums.leftRight = -1
                    this.btf.locallyTranslate(new Vector3(moveNums.leftRight * btfRadius,0,moveNums.straight *btfRadius))
                    this.myChar._moving = true
                    // this.btf.locallyTranslate(new Vector3(-this.runSpeed - 100,0,0))
                    sendToSocket()
                break
                case "d":
                    moveFunc()

                    moveNums.leftRight = 0
                    moveNums.leftRight = 1
                    this.btf.locallyTranslate(new Vector3(moveNums.leftRight * btfRadius,0,moveNums.straight * btfRadius))
                    this.myChar._moving = true
                    // this.btf.locallyTranslate(new Vector3(this.runSpeed + 100,0,0))
                    sendToSocket()
                break
                case "s":
                    moveFunc()
                    moveNums.straight = 0
                    moveNums.straight = -1
                    this.btf.locallyTranslate(new Vector3(moveNums.leftRight * btfRadius,0,moveNums.straight * btfRadius))
                    this.myChar._moving = true
                    // this.btf.locallyTranslate(new Vector3(0,0,-this.runSpeed - 100))
                    sendToSocket()
                break
                case "alt":
                    log("clicking the alt")
                    this.disableMoving()
                break
            }
            const btfPos = this.btf.position
            me.dirTarg = {x: btfPos.x,z: btfPos.z}
        })

        document.addEventListener("keyup", e => {

            if(!this._canpress || !canPress || this.det.hp <=0) return log("you are dead or canPress false")
            const keyPressed = e.key.toLowerCase()

            if(keyPressed === "p"){                
                // log({x:this.myChar.bx.position.x,z:this.myChar.bx.position.z})
                // // this.obtain("hukla", "x2", false)
                // // this.checkAll()
                // // log(this.det)
                this.det.coins+= 400
                this.det.lvl++
                this.det.hp+=50
                this.det.maxHp+=50
                this.det.mp+=50
                this.det.maxMp+=50
                // // this.det.stats.spd+=.5
                // const meSelf = players.find(pl => pl._id ===this.det._id)
                // if(meSelf){
                //     meSelf.spd += 1
                //     log(meSelf.spd)
                    
                //     this._statPopUp("+spd +coins +lvl", 100);
                // }
                
                closeGameUI()
                this.det.skills = skills
                this.updateMyDetailsOL(this.det, true)
                let intervalWait
                intervalWait = setInterval(() => {
                    if(this.det.skills.length >= 4){
                        clearInterval(intervalWait)
                        openGameUI()
                        this.setMySkills()
                    }
                }, 1000)                
            }  
            if(keyPressed === " "){
                log({x:this.myChar.bx.position.x,z:this.myChar.bx.position.z})
                log("my details",this.det)
                log(this.lootz)
                // this.myChar.mode = "poisoned"
                // this.det.maxHp += 200
                // this.det.hp+=199
            }
            if(keyPressed === "m") this.det.coins+=20000
            if(keyPressed === "/"){
                const myFosNow = this.myChar.bx.position
                const freeCam = new FreeCamera("asfka", new Vector3(myFosNow.x, 2, myFosNow.z))
                this._scene.activeCamera = freeCam
                freeCam.attachControl(canvas, true);
                closeGameUI()
                lifeManaStamCont.style.display = "none"
                this.myChar.nameMesh.isVisible = false;
                this.myChar.playerHealthMesh.isVisible = false;
            }
            if(keyPressed === "m") {
                this.myChar.nameMesh.isVisible = false;
                log(Monsterz)}
            if(keyPressed === "q") this.myChar.bx.locallyTranslate(new Vector3(0,0,2))
            clearTimeout(this.savingTimeout)
            
            switch(keyPressed){
                case "w":
                    moveNums.straight = 0
                    
                    if(moveNums.leftRight === 0) {this.stopMoving()}else{
                        resetBtfLookAndPos()
                        this.btf.locallyTranslate(new Vector3(moveNums.leftRight * btfRadius,0,moveNums.straight * btfRadius))
                        this.socketAvailable && this.socket.emit("redirectTarg", {_id: this.det._id, dirTarg: { x: this.btf.position.x, z: this.btf.position.z}})
                    }
                break
                case "a":
                    moveNums.leftRight = 0
                    
                    if(moveNums.straight === 0) {this.stopMoving()}else{
                        resetBtfLookAndPos()
                        this.btf.locallyTranslate(new Vector3(moveNums.leftRight * btfRadius,0,moveNums.straight * btfRadius))
                        this.socketAvailable && this.socket.emit("redirectTarg", {_id: this.det._id, dirTarg: { x: this.btf.position.x, z: this.btf.position.z}})
                    }
                break;
                case "d":
                    moveNums.leftRight = 0
                    
                    if(moveNums.straight === 0) {this.stopMoving()}else{
                        resetBtfLookAndPos()
                        this.btf.locallyTranslate(new Vector3(moveNums.leftRight * btfRadius,0,moveNums.straight * btfRadius))
                        this.socketAvailable && this.socket.emit("redirectTarg", {_id: this.det._id, dirTarg: { x: this.btf.position.x, z: this.btf.position.z}})
                    }
                break;
                case "s":
                    moveNums.straight = 0   
                   
                    if(moveNums.leftRight === 0) {this.stopMoving()}else{
                        resetBtfLookAndPos()
                        this.btf.locallyTranslate(new Vector3(moveNums.leftRight * btfRadius,0,moveNums.straight * btfRadius))
                        this.socketAvailable && this.socket.emit("redirectTarg", {_id: this.det._id, dirTarg: { x: this.btf.position.x, z: this.btf.position.z}})
                    }
                break

            }
        })
  
    }
    registerBlocks(myChar, spdBackwards){
        this.blocks.forEach(block => {
            this.myChar.bx.actionManager.registerAction(new ExecuteCodeAction(
                {
                    trigger: ActionManager.OnIntersectionEnterTrigger,
                    parameter: block
                }, e => {                    
                    if(this.myChar.mode === "stand"){
                        if(block.name.includes("wall")) return this.bump(this.myChar)
                        const totalBack = this.walkSpeed + spdBackwards + 2.2
                        this.myChar.bx.locallyTranslate(new Vector3(0,0,-totalBack*(this._engine.getDeltaTime()/1000) ))
                    }else{
                        this.bump(this.myChar)
                    }                                    
                }
            ))
        })
    }
    toRegAction(mesh, toCollideMesh, callback){
        mesh.actionManager.registerAction(new ExecuteCodeAction(
            {
                trigger: ActionManager.OnIntersectionEnterTrigger,
                parameter: toCollideMesh
            }, e => {
                callback()
            }
        ))
    }
    toRegActionExit(mesh, toCollideMesh, callback){
        mesh.actionManager.registerAction(new ExecuteCodeAction(
            {
                trigger: ActionManager.OnIntersectionExitTrigger,
                parameter: toCollideMesh
            }, e => {
                callback()
            }
        ))
    }
    arrangeMesh(mesh, pos, dirTarg, willLookAt){
        const {x,y,z} = pos
        mesh.position = new Vector3(x,y,z)
        
        willLookAt && mesh.lookAt(new Vector3(dirTarg.x,mesh.position.y, dirTarg.z),0,0,0)
    }
    arrangeCam(alpha, beta){
        this.cam.alpha = alpha
        this.cam.beta = beta
    }
    suitUpdate(meshes, hairName, clothName, pantsName, bootsName, hColor, scene, light){
        const hairMat = new BABYLON.StandardMaterial(`hairMat.${makeRandNum()}`, scene)
        const {r,g,b} = hColor
        hairMat.diffuseColor = new BABYLON.Color3(r,g,b)
        hairMat.roughness = 1
        hairMat.ambientColor = new BABYLON.Color3(0,0,0);
        let theHair
        meshes.forEach(mesh => {
            if(mesh.name.includes("hair")){
                if(mesh.name.includes(hairName)){
                    mesh.isVisible = true;
                    mesh.material = hairMat
                    mesh.material.specularColor = new BABYLON.Color3(0,0,0)
                    theHair = mesh
                }else{
                    mesh.dispose()
                }
            } 
            if(mesh.name.includes("cloth")) mesh.name.includes(clothName) ? mesh.isVisible = true : mesh.dispose()
            if(mesh.name.includes("pants")) mesh.name.includes(pantsName) ? mesh.isVisible = true : mesh.dispose()
            if(mesh.name.includes("boots")) mesh.name.includes(bootsName) ? mesh.isVisible = true : mesh.dispose()
            light.excludedMeshes.push(mesh)
        })
        return theHair
    }
    showArmor(armors, armorName){
        armors.forEach(armor => {
            if(armor.name.includes(armorName)){
                armor.isVisible = true;
            }else{
                armor.isVisible = false
            }
        })
    }
    hideAllSword(swordz){
        swordz.forEach(sword => {
            sword.isVisible = false
            if(sword.getChildren()){
                sword.getChildren().forEach(chld => chld.isVisible = false)
            }
        })
    }
    freeze(mesh){
        mesh.material.freeze()
        mesh.freezeWorldMatrix()
    }
    // CREATIONS
    async creationSlash(scene){
        slash = await this.importMesh(scene, "./models/", "slash.glb", true)
        slash.rotationQuaternion = null
        slash.position = new Vector3(0,100,0)
    }
    async createWagon(lookDir, pos, scene){
        const wagon = await this.importMesh(scene, "./models/", "wagon.glb")
        wagon.meshes[1].parent = null
        wagon.meshes[1].position = new Vector3(pos.x,pos.y,pos.z);
        wagon.meshes[1].rotationQuaternion = null
        const lr = lookDir
        wagon.meshes[1].lookAt(new Vector3(lr.x,lr.y,lr.z), 0,0,0)
        this.blocks.push(wagon.meshes[1])
        this.putFakeShadow(wagon.meshes[1], 8, .07)
        this.freeze(wagon.meshes[1])
    }
    async createPeeble(imgAddress, scene, capac, xRange, zRange){
        const Pebbles = await this.importMesh(scene, "./models/", "pebbles.glb")
        thePeeble = Pebbles.meshes[1]; thePeeble.setParent(null)
        thePeeble.rotationQuaternion = null
        thePeeble.scaling = new Vector3(.5,.5,.5);
        thePeeble.position = new Vector3(0,0,0)
        const peebMat = new StandardMaterial("peebMat", scene)
        peebMat.diffuseTexture = new Texture(imgAddress);
        peebMat.specularColor = new Color3(0,0,0)
        thePeeble.material = peebMat;
        let peeblePieces = capac
        for(var i = 0;i <= peeblePieces;i ++){
            const newX = BABYLON.Scalar.RandomRange(xRange.xmin, xRange.xmax)
            const newZ = BABYLON.Scalar.RandomRange(zRange.zmin, zRange.zmax)
            const fins = new Matrix.Translation(newX,0,newZ);
            thePeeble.thinInstanceAdd(fins)
            thePeeble.thinInstanceSetMatrixAt(thePeeble, fins);
        }
        thePeeble.freezeWorldMatrix();
        thePeeble.material.freeze()
        return thePeeble
    }
    async createDungeonTiles(scene){
        const tile = await this.importMesh(scene, "./models/", "tile.glb")
        tile.meshes.forEach(tle => tle.receiveShadows = true)
        for(var i = -110;i <= 120;i += 7){
            const newX = 0
            const newZ = i
            const fins = new Matrix.Translation(newX,0,newZ + Math.random()* 2.3);
            tile.meshes[1].thinInstanceAdd(fins)
            tile.meshes[1].thinInstanceSetMatrixAt(tile.meshes[1], fins)
            loadedMesh+= 2
        }
        for(var i = -110;i <= 120;i += 7){
            const newX = 10.7
            const newZ = i
            const fins = new Matrix.Translation(newX,0,newZ + Math.random()* 2);
            tile.meshes[1].thinInstanceAdd(fins)
            tile.meshes[1].thinInstanceSetMatrixAt(tile.meshes[1], fins)
            loadedMesh+= 2
        }
        for(var i = -110;i <= 120;i += 7){
            const newX = -10.7
            const newZ = i
            const fins = new Matrix.Translation(newX,0,newZ + Math.random()* 1);
            tile.meshes[1].thinInstanceAdd(fins)
            tile.meshes[1].thinInstanceSetMatrixAt(tile.meshes[1], fins)
            loadedMesh+= 2
        }
        for(var i = -110;i <= 120;i += 7){
            const newX = 20.7
            const newZ = i
            const fins = new Matrix.Translation(newX,0,newZ + Math.random()* 2);
            tile.meshes[1].thinInstanceAdd(fins)
            tile.meshes[1].thinInstanceSetMatrixAt(tile.meshes[1], fins)
            loadedMesh+= 2
        }
        for(var i = -110;i <= 120;i += 7){
            const newX = -20.7
            const newZ = i
            const fins = new Matrix.Translation(newX,0,newZ + Math.random()* 1);
            tile.meshes[1].thinInstanceAdd(fins)
            tile.meshes[1].thinInstanceSetMatrixAt(tile.meshes[1], fins)
            loadedMesh+= 2
        }
        for(var i = -110;i <= 120;i += 7){
            const newX = 30.7
            const newZ = i
            const fins = new Matrix.Translation(newX,0,newZ + Math.random()* 2);
            tile.meshes[1].thinInstanceAdd(fins)
            tile.meshes[1].thinInstanceSetMatrixAt(tile.meshes[1], fins)
            loadedMesh+= 2
        }
        for(var i = -110;i <= 120;i += 7){
            const newX = -30.7
            const newZ = i
            const fins = new Matrix.Translation(newX,0,newZ + Math.random()* 1);
            tile.meshes[1].thinInstanceAdd(fins)
            tile.meshes[1].thinInstanceSetMatrixAt(tile.meshes[1], fins)
            loadedMesh+= 2
        }
    }
    async helmetCreation(scene){
        const forHelmets = []
        const Helmets = await this.importMesh(scene, "./models/", "helmets.glb");
        Helmets.meshes[0].getChildren().forEach(helm => {
            if(helm.name === "head") return helm.dispose();
            helm.parent = null
            forHelmets.push(helm)
            helm.position.y = 100
        })
        allhelmets = forHelmets
    }
    async shieldCreation(scene){
        const Shields = await this.importMesh(scene, "./models/", "shields.glb")
        allshields = Shields.meshes[0].getChildren()
        allshields.forEach(swordv => {
            swordv.parent = null
            swordv.position.y = 100
        })

    }
    async createWoodPlank(scene){
        const WoodPlank = await this.importMesh(scene, "./models/", "plank.glb");
        roadplank = WoodPlank.meshes[1];
        roadplank.parent = null
        WoodPlank.meshes[0].dispose()

        const DangerSign = await this.importMesh(scene, "./models/", "dangerSign.glb");
        dangerPlank = DangerSign.meshes[0];
        dangerPlank.parent = null
        dangerPlank.rotationQuaternion = null
        // DangerSign.meshes[0].dispose()
        roadplank.position.y = 100
        dangerPlank.position.y = 100
    }
    async createMugRoot(scene){
        mugMesh = await this.importMesh(scene, "./models/", "mug.glb", true);
    }
    async createMainWings(scene){
        wingRoot = await BABYLON.SceneLoader.LoadAssetContainerAsync("./models/", "wings.glb", scene)
    }
    async createMainPats(scene){
        patsRoot = await this.importMesh(scene, "./models/", "heroPaths.glb", true)
        patsRoot.position = new Vector3(0,100,0)
    }
    createSceneGlow(intensity, scene){
        const gl = new BABYLON.GlowLayer("glow", scene);
        gl.intensity = intensity
    }
    createMainHitBox(scene, imgName, size, aHeight){
        const hitBxMat = new StandardMaterial("hitBxMat")
        const theTexture = new Texture(`./images/modeltex/${imgName}`)
        hitBxMat.diffuseTexture = theTexture
        const hitBx = MeshBuilder.CreateBox("hitBox", { size, height: aHeight ? aHeight : size }, scene)
        hitBx.material = hitBxMat;
        hitBxMat.specularColor = new Color3(0,0,0)
        
        hitBx.position.y = 100

        this.hitBox = hitBx
    }
    createHitBx(scene, meshId, pos, hp, scaleSize, posY, lootRarity,cb){
        const bx = this.hitBox.createInstance("hitbox")
        bx.position = new Vector3(pos.x,pos.y,pos.z)
        let secBx
        const bxHeight = this.getMeshHeight(bx)
        let boxSound;
        let explodeS
        const smokePrtcle = this.createSmoke(scene, (partcle) => {
            partcle.emitRate = 30
            partcle.createSphereEmitter(1);
            partcle.updateSpeed = .06
            partcle.emitter = bx
        });
        smokePrtcle.targetStopDuration = 1.5
        let delayPlay = 0
        switch(this.currentPlace){
            case "heartland":
                secBx = this.hitBox.createInstance("hitbox")
                secBx.position = new Vector3(pos.x,bxHeight+bxHeight/2,pos.z)
                boxSound = this._allSounds.boxHitS.clone()
                explodeS = this._allSounds.brokenWoods.clone()
                secBx.addRotation(0,Math.random()*4, 0);
                this.freeze(secBx)
                this.putFakeShadow(bx, 2, -pos.y+.02)
            break;
            default:
                delayPlay = .2
                // dungeon is default
                boxSound = this._allSounds.boxHitS.clone()
                explodeS = this._allSounds.superPunched.clone()
                this.putFakeShadow(bx, 6, -pos.y+.02)
            break;
        }
        if(boxSound) boxSound.attachToMesh(bx)
        if(explodeS) explodeS.attachToMesh(bx)

        if(scaleSize){
            const { x,y,z } = scaleSize
            bx.scaling = new Vector3(x,y,z)
            bx.position.y = posY
        }
        
        bx.actionManager = new ActionManager(scene)
        this.toRegAction(bx, this.myChar.weaponCol, () => {
            const theHitBx = this.allHitBox.find(hbx => hbx.meshId === meshId)
            if(!theHitBx) return log("hit bx not found")
            
            const dmg = this.recalMeeleDmg()
    
            theHitBx.hp -= dmg
            if(this.myChar.mode === "weapon"){
                if(boxSound){
                    boxSound.setPlaybackRate(.9+Math.random()*.3)
                    boxSound.play()
                }
            }else{
                this.myChar.punchedS.play()
            }
            smokePrtcle.start()
            
            if(theHitBx.hp <= 0){
                
                this.calibrateLoot(lootRarity)
                if (bx.actionManager) {
                    bx.actionManager.dispose();
                    bx.actionManager = null;
                }
                explodeS.play(delayPlay)
                smokePrtcle.disposeOnStop = true
                smokePrtcle.targetStopDuration = 2
                smokePrtcle.start()
                this.allHitBox = this.allHitBox.filter(hbx => hbx.meshId !== theHitBx.meshId)                
        
                theHitBx.mesh.isVisible = false
                if(secBx){
                    secBx.isVisible = false
                    this.disposeMeeleeMesh(secBx, 2500)
                }
                
                this.disposeMeeleeMesh(theHitBx.mesh, 2500)
                this.disposeSounds([boxSound,explodeS], 2500)

                if(cb){
                    cb(theHitBx.mesh.getAbsolutePosition())
                }
            }
        })
        this.toRegAction(bx, this.myChar.bx, () => {
            const theHitBx = this.allHitBox.find(hbx => hbx.meshId === meshId)
            if(!theHitBx) return log("hit bx not found")
            this.bump(this.myChar)
        })
        
        this.allHitBox.push({meshId, mesh: bx, hp, maxHp: hp})
        this.freeze(bx)        
    }
    createGolemRock(scene){
        const littleSmoke = smoke.clone("rockSmoke")
        const mat = new StandardMaterial("golemMat", scene)
        mat.diffuseTexture = new Texture("./images/modeltex/stonefloor.jpg")
        mat.specularColor = new Color3(0,0,0)
        this.likeRock = BABYLON.Mesh.CreateIcoSphere("icosphere", {radius:.4, flat:true, subdivisions: 1}, scene);
        this.likeRock.material = mat
        littleSmoke.emitter = this.likeRock
    }
    createBeeSting(scene){
        
        this.likeSting = BABYLON.MeshBuilder.CreateCylinder("cylinder", {diameterTop: 0}, scene);
        this.likeSting.scaling = new Vector3(.1,.5,.1)
        
    }
    createHeartLandTile(scene){
        //groundTex
        const landTile = this.createFloor("./images/modeltex/groundTex.png", scene, {x: 0, z: -75}, true)
        let tileVertical = 170;
        for(var startingTile = -79;startingTile <= tileVertical;startingTile += 2 + Math.random()*3){

            const fins = new Matrix.Translation(0,0,startingTile);
            landTile.thinInstanceAdd(fins)
            landTile.thinInstanceSetMatrixAt(landTile, fins)

        }
        for(var startingTile = -79;startingTile <= tileVertical;startingTile += 2 + Math.random()*2){

            const fins = new Matrix.Translation(1.9 + Math.random()*.3,0,startingTile);
            landTile.thinInstanceAdd(fins)
            landTile.thinInstanceSetMatrixAt(landTile, fins)
        }
        for(var startingTile = -79;startingTile <= tileVertical;startingTile += 2 + Math.random()*2){

            const fins = new Matrix.Translation(-1.9 - Math.random()*.3,0,startingTile);
            landTile.thinInstanceAdd(fins)
            landTile.thinInstanceSetMatrixAt(landTile, fins)
        }

        for(var startingTile = -79;startingTile <= tileVertical;startingTile += 2 + Math.random()*2){

            const fins = new Matrix.Translation(startingTile, 0,0);
            landTile.thinInstanceAdd(fins)
            landTile.thinInstanceSetMatrixAt(landTile, fins)
        }
        for(var startingTile = -79;startingTile <= tileVertical;startingTile += 2 + Math.random()*2){

            const fins = new Matrix.Translation(startingTile+Math.random()*1, 0, 2);
            landTile.thinInstanceAdd(fins)
            landTile.thinInstanceSetMatrixAt(landTile, fins)
        }
        for(var startingTile = -79;startingTile <= tileVertical;startingTile += 2 + Math.random()*2){

            const fins = new Matrix.Translation(startingTile+Math.random()*1, 0, 4);
            landTile.thinInstanceAdd(fins)
            landTile.thinInstanceSetMatrixAt(landTile, fins)
        }
        for(var startingTile = -79;startingTile <= tileVertical;startingTile += 2 + Math.random()*2){

            const fins = new Matrix.Translation(startingTile+Math.random()*1, 0, 17);
            landTile.thinInstanceAdd(fins)
            landTile.thinInstanceSetMatrixAt(landTile, fins)
        }
        // for(var startingTile = -79;startingTile <= tileVertical;startingTile += 2 + Math.random()*2){

        //     const fins = new Matrix.Translation(startingTile+Math.random()*1, 0, 30);
        //     landTile.thinInstanceAdd(fins)
        //     landTile.thinInstanceSetMatrixAt(landTile, fins)
        // }
        // for(var startingTile = -79;startingTile <= tileVertical;startingTile += 2 + Math.random()*2){

        //     const fins = new Matrix.Translation(startingTile+Math.random()*1, 0, 20);
        //     landTile.thinInstanceAdd(fins)
        //     landTile.thinInstanceSetMatrixAt(landTile, fins)
        // }
    }
    createDangerSign(scene, pos, dirTarg){
        if(!roadplank || !dangerPlank) return log("planks not yet made")
        const newPlank = roadplank.clone("sign");
        newPlank.parent = null;
        newPlank.position = new Vector3(pos.x,pos.y,pos.z);

        const newSignBoard = dangerPlank.clone("signBoard");
        newSignBoard.parent = newPlank
        newSignBoard.rotationQuaternion = null
        newSignBoard.position=new Vector3(0,.7,-.06);
        newSignBoard.addRotation(0,Math.PI,0)
        window.addEventListener("keydown", e => {
            if(e.key === "u") newSignBoard.addRotation(0,0,.5)   
        })

        this.putFakeShadow(newPlank, false, -.45)
    }
    createSwamps(direct, scene, startPos, tileMax, xNum, zNum){
        const landTile = this.createFloor(direct, scene, startPos, true, {h: 15, w: 15}, .04)
        // const bigLandTile = this.createFloor("./images/modeltex/swmpTex1.png", scene, {x: 0, z: 0}, true, {h: 5, w: 5})

        for(var startingNum = 0; startingNum <= tileMax; startingNum++){
            const randX = BABYLON.Scalar.RandomRange(xNum.min,xNum.max)
            const randZ = BABYLON.Scalar.RandomRange(zNum.min,zNum.max)
            const fins = new Matrix.Translation(randX,0,randZ);
            landTile.thinInstanceAdd(fins)
            landTile.thinInstanceSetMatrixAt(landTile, fins)
        }
    }
    createSwmpTile(scene){
        const landTile = this.createFloor("./images/modeltex/grassGround.png", scene, {x: 0, z: 0}, true, {h: 15, w: 15}, .04)
        let tileMax = 100;
        // const bigLandTile = this.createFloor("./images/modeltex/swmpTex1.png", scene, {x: 0, z: 0}, true, {h: 5, w: 5})

        for(var startingNum = 0; startingNum <= tileMax; startingNum++){
            const randX = BABYLON.Scalar.RandomRange(-25,25)
            const randZ = BABYLON.Scalar.RandomRange(85,120)
            const fins = new Matrix.Translation(randX,0,randZ);
            landTile.thinInstanceAdd(fins)
            landTile.thinInstanceSetMatrixAt(landTile, fins)
        }
        // for(var startingNum = 0; startingNum <= tileMax; startingNum++){
        //     const randX = BABYLON.Scalar.RandomRange(-10,10)
        //     const randZ = BABYLON.Scalar.RandomRange(80,110)
        //     const fins = new Matrix.Translation(randX,0,randZ);
        //     bigLandTile.thinInstanceAdd(fins)
        //     bigLandTile.thinInstanceSetMatrixAt(bigLandTile, fins)
        // }
    }
    createHLPlanks(){
        // entrance to half way
        for(var plankzqnty = -60;plankzqnty < -20; plankzqnty+=2){
            if(Math.random() < .85 ){
                this.createRoadPlank({x: -4.2, z: plankzqnty+Math.random()*1}, Math.PI/2 - Math.random()*.5 + Math.random()*.7)
                this.createRoadPlank({x: 4.2, z: plankzqnty+Math.random()*1}, Math.PI/2 - Math.random()*.5 + Math.random()*.7)
            }            
        }
        // half way to guild
        for(var plankzqnty = 15;plankzqnty < 50; plankzqnty+=2){
            
            if(plankzqnty > 25) this.createRoadPlank({x: -4, z: plankzqnty+Math.random()*1}, Math.PI/2 - Math.random()*.5 + Math.random()*.7)
            this.createRoadPlank({x: 4, z: plankzqnty+Math.random()*1}, Math.PI/2 - Math.random()*.5 + Math.random()*.7)
        } 

        // half way to side left
        for(var plankzqnty = -5;plankzqnty >= -52; plankzqnty-=2){
            if(Math.random() < .85 ){
                this.createRoadPlank({x: plankzqnty-Math.random()*1, z: -20}, -1 + Math.random()*1)
                this.createRoadPlank({x: plankzqnty-Math.random()*1, z: -7.5}, -1 + Math.random()*1)
                this.createRoadPlank({x: plankzqnty-Math.random()*1, z: 30}, -1 + Math.random()*1)
    
                // near the entrace
                this.createRoadPlank({x: plankzqnty-Math.random()*1, z: -58}, -1 + Math.random()*1)
            }
        } 
        // half way to side left
        for(var plankzqnty = 5;plankzqnty <= 52; plankzqnty+=2){
            if(Math.random() < .85 ){
                this.createRoadPlank({x: plankzqnty-Math.random()*1, z: -20}, -1 + Math.random()*1)
                this.createRoadPlank({x: plankzqnty-Math.random()*1, z: -7.5}, -1 + Math.random()*1)
    
                this.createRoadPlank({x: plankzqnty-Math.random()*1, z: -58}, -1 + Math.random()*1)    
            }
        } 
    }
    createSwampDungeonWall(TheTile, scene){
        const Tile = TheTile
        let posY = 5.4
        for(var i = -15; i <= 15;i+=5){
            const tileIns = Tile.meshes[1].createInstance("wall");
            tileIns.parent = null
            tileIns.position = new Vector3(i,posY,-12.6);
            tileIns.rotation = new Vector3(-Math.PI/2,0,0)
            tileIns.checkCollisions = true
            this.freeze(tileIns)

            const backTile = Tile.meshes[1].createInstance("wall");
            backTile.parent = null
            backTile.position = new Vector3(i,posY,8.3);
            backTile.rotation = new Vector3(Math.PI/2,0,0)
            backTile.checkCollisions = true
            this.freeze(backTile)
            this.blocks.push(tileIns);
            this.blocks.push(backTile);
        }
        for(var i = -7.1; i < 6;i+=5){
            const lTile = Tile.meshes[1].createInstance("wall");
            lTile.parent = null
            lTile.position = new Vector3(-20.5,posY,i);
            lTile.rotation = new Vector3(0,0,Math.PI/2)
            lTile.checkCollisions = true
            this.freeze(lTile)

            const rTile = Tile.meshes[1].createInstance("wall");
            rTile.parent = null
            rTile.position = new Vector3(20.5,posY,i);
            rTile.rotation = new Vector3(0,0,-Math.PI/2)
            rTile.checkCollisions = true
            this.freeze(rTile);
            this.blocks.push(lTile);
            this.blocks.push(rTile);
        }
    }
    createScroll(mesh, pos, scene, mess){
        const scroll = mesh.clone('scroll')
        scroll.position = new Vector3(pos.x,0,pos.z)
        scroll.actionManager = new ActionManager(scene)
        this.toRegAction(scroll, this.myChar.bx, () => {
            this.openPopUpAction('pickup')
            this.targDetail = {name: mess, itemType: 'scroll'}
            this.targetRecource = scroll
        })
        scroll.actionManager.registerAction(new ExecuteCodeAction(
            {
                trigger: ActionManager.OnIntersectionExitTrigger,
                parameter: this.myChar.bx
            }, e => {
                this.closePopUpAction()
                this.targDetail = undefined
                this.targetRecource = undefined
            }
        ))
    }
    createFog(scene, densty){
        scene.fogMode = Scene.FOGMODE_EXP;
        scene.fogDensity = densty
        scene.fogColor = scene.clearColor;
    }
    createBoxToFollow(scene){
        const btf = MeshBuilder.CreateBox("btf", {size: .5}, scene); 
        btf.position = new Vector3(0,this.yPos,-1)
        btf.isVisible = false

        this.btf = btf
        myBtf = btf
        return btf
    }
    createRoadPlank(pos, rotateSide){
        const leftPlank = roadplank.clone("leftPlank")
        const rightPlank = roadplank.clone("rightPlank")
        const topPlank = roadplank.clone("topPlank")
     
        
        rightPlank.position = new Vector3(pos.x,.5,pos.z)
        const {x,z} = rightPlank.getAbsolutePosition();
        topPlank.parent = rightPlank
        leftPlank.parent = rightPlank
        topPlank.position = new Vector3(-.4,.2,0)
        topPlank.addRotation(0,0,Math.PI/2+Math.random()*.5)
        leftPlank.position = new Vector3(-.8,0,0)
      
        if(rotateSide)rightPlank.addRotation(0,rotateSide,0)
        this.blocks.push(topPlank)
    }
    createWoodTall(pos,scaleUp, woodFat, dirTarg, rotat){
        const { x,y,z } = dirTarg
        const tallWood = roadplank.clone("wood");
        tallWood.position = new Vector3(pos.x,pos.y,pos.z)
        tallWood.scaling = new Vector3(woodFat,scaleUp,woodFat)
        tallWood.lookAt(new Vector3(x,tallWood.position.y,z),0,0,0)
        if(rotat)tallWood.addRotation(rotat.x,0,rotat.z)
    }
    createPSystem(theJson,scene){

        const pSystem = ParticleSystem.Parse(theJson, scene, "")

        return {
            psJson:theJson,
            pSystem
        }
    }
    createExplodingSmoke(scene){
        const explodingSmoke = new BABYLON.ParticleSystem("particles", 8000, scene);

        //Texture of each particle
        explodingSmoke.particleTexture = new BABYLON.Texture("./images/particles/smoke.png", scene);
    
        // lifetime
        explodingSmoke.minLifeTime = .4
        explodingSmoke.maxLifeTime = 1
    
        // emit rate
        explodingSmoke.emitRate = 1;
    
        // gravity
        //explodingSmoke.gravity = new BABYLON.Vector3(0.25, 1.5, 0);
        explodingSmoke.gravity = new BABYLON.Vector3(0,.1,0);
    
        // size gradient
        explodingSmoke.addSizeGradient(0, 0.6, .4);
        explodingSmoke.addSizeGradient(0.3, .7, .4);
        explodingSmoke.addSizeGradient(0.3, .7, .5);
        explodingSmoke.addSizeGradient(.4, .7, .8);

        // color gradient
        explodingSmoke.addColorGradient(0, new BABYLON.Color4(0.5, 0.5, 0.5, 0),  new BABYLON.Color4(0.8, 0.8, 0.8, 0));
        explodingSmoke.addColorGradient(0.4, new BABYLON.Color4(0.1, 0.1, 0.1, 0.1), new BABYLON.Color4(0.4, 0.4, 0.4, 0.4));
        explodingSmoke.addColorGradient(0.7, new BABYLON.Color4(0.03, 0.03, 0.03, 0.2), new BABYLON.Color4(0.3, 0.3, 0.3, 0.4));
        explodingSmoke.addColorGradient(1.0, new BABYLON.Color4(0.0, 0.0, 0.0, 0), new BABYLON.Color4(0.03, 0.03, 0.03, 0));

        // speed gradient
        explodingSmoke.addVelocityGradient(0, 1, 1.5);
        explodingSmoke.addVelocityGradient(0.1, 0.8, 0.9);
        explodingSmoke.addVelocityGradient(0.7, 0.4, 0.5);
        explodingSmoke.addVelocityGradient(1, 0.1, 0.2);

        // rotation
        // explodingSmoke.minInitialRotation = 0;
        // explodingSmoke.maxInitialRotation = Math.PI;
        // explodingSmoke.minAngularSpeed = -1;
        // explodingSmoke.maxAngularSpeed = 1;

        // blendmode
        explodingSmoke.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;
        explodingSmoke.createCylinderEmitter(6, 0)
        explodingSmoke.start()

        return explodingSmoke
    }
    createFeetSmoke(psSys, minR, maxR, emitRate, theHeight, mesh){
        const feetSmoke = psSys.clone(`smokefeet.${makeRandNum()}`)
        feetSmoke.minLifeTime = minR
        feetSmoke.maxLifeTime = maxR
        feetSmoke.emitRate = emitRate
        feetSmoke.emitter = mesh
        feetSmoke.updateSpeed = .051
        feetSmoke.radiusRange = 0
        feetSmoke.createCylinderEmitter(1.3, theHeight)
        return feetSmoke
    }
    createSmoke(scene, otherInfo){
        const particleSystem = new BABYLON.ParticleSystem("particles", 8000, scene);

        //Texture of each particle
        particleSystem.particleTexture = new BABYLON.Texture("./images/particles/smoke.png", scene);
    
        // lifetime
        particleSystem.minLifeTime = 1;
        particleSystem.maxLifeTime = 1.3;
    
        // emit rate
        particleSystem.emitRate = 5;
    
        // gravity
        particleSystem.gravity = new BABYLON.Vector3(0.25, 1.5, 0);
    
        // size gradient
        particleSystem.addSizeGradient(0, 0.6, .7);
        particleSystem.addSizeGradient(0.3, 1, .9);
        particleSystem.addSizeGradient(0.5, 1, 1);
        particleSystem.addSizeGradient(.9, .8, 2);
    
        // color gradient
        particleSystem.addColorGradient(0, new BABYLON.Color4(0.5, 0.5, 0.5, 0),  new BABYLON.Color4(0.8, 0.8, 0.8, 0));
        particleSystem.addColorGradient(0.4, new BABYLON.Color4(0.1, 0.1, 0.1, 0.1), new BABYLON.Color4(0.4, 0.4, 0.4, 0.4));
        particleSystem.addColorGradient(0.7, new BABYLON.Color4(0.03, 0.03, 0.03, 0.2), new BABYLON.Color4(0.3, 0.3, 0.3, 0.4));
        particleSystem.addColorGradient(1.0, new BABYLON.Color4(0.0, 0.0, 0.0, 0), new BABYLON.Color4(0.03, 0.03, 0.03, 0));
    
        // speed gradient
        particleSystem.addVelocityGradient(0, 1, 1.5);
        particleSystem.addVelocityGradient(0.1, 0.8, 0.9);
        particleSystem.addVelocityGradient(0.7, 0.4, 0.5);
        particleSystem.addVelocityGradient(1, 0.1, 0.2);
    
        // rotation
        particleSystem.minInitialRotation = 0;
        particleSystem.maxInitialRotation = Math.PI;
        particleSystem.minAngularSpeed = -1;
        particleSystem.maxAngularSpeed = 1;
    
        // blendmode
        particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;
        
        // emitter shape
        const sphereEmitter = particleSystem.createSphereEmitter(0.1);
        particleSystem.stop()

        if(otherInfo) otherInfo(particleSystem)

        return particleSystem
    }
    createTransparentSign(scene, imgDir, parent, pos, rotat){
        const transpaMesh = MeshBuilder.CreateGround("transpaMesh", {width: 5, height: 5}, scene)
        const transpaMat = new StandardMaterial("transpaMeshMat", scene);
        transpaMat.diffuseTexture = new Texture(imgDir, scene)
        
        transpaMesh.material = transpaMat
        transpaMat.specularColor = new Color3(0,0,0)
        transpaMat.diffuseTexture.hasAlpha = true;
        transpaMat.useAlphaFromDiffuseTexture = true;
        transpaMesh.parent = parent
        transpaMesh.position = new Vector3(pos.x,pos.y,pos.z)
        transpaMesh.rotationQuaternion = null
        transpaMesh.addRotation(rotat.x,rotat.y,rotat.z)
    }
    creationOfFakeShadow(scene){
        fakeShadow = MeshBuilder.CreateGround("fakeShadow", {width: .9, height: .9}, scene)
        const fakeShadowMat = new StandardMaterial("fakeShadowMat", scene);
        fakeShadowMat.diffuseTexture = new Texture("./images/modeltex/fakeShadow.png", scene)
        
        fakeShadow.material = fakeShadowMat
        fakeShadowMat.specularColor = new Color3(0,0,0)
        fakeShadowMat.diffuseTexture.hasAlpha = true;
        fakeShadowMat.useAlphaFromDiffuseTexture = true;
        fakeShadow.position.y = 100
    }
    createBloodParticle(imgTex,capac, monsFos, particleType, willStart, targStop, willDisposeOnStop, emitterMesh){
        const myParticleSystem = new BABYLON.ParticleSystem(`bloodParticle.${makeRandNum()}`, capac)
        
        if(particleType === "sphere") myParticleSystem.createSphereEmitter(1);
        myParticleSystem.particleTexture = new BABYLON.Texture(`./images/particles/${imgTex}.png`, scene);
        if(monsFos) myParticleSystem.emitter = new Vector3(monsFos.x,monsFos.y+Math.random()*.4,monsFos.z)
        if(emitterMesh) myParticleSystem.emitter = emitterMesh
        if(willStart) myParticleSystem.start()
        if(willDisposeOnStop) myParticleSystem.disposeOnStop = true;
        myParticleSystem.targetStopDuration = targStop
        myParticleSystem.updateSpeed = 0.05;
        myParticleSystem.minSize = 0.2;
        myParticleSystem.maxSize = 0.9;
        myParticleSystem.gravity = new BABYLON.Vector3(0, -.5, 0);
        return myParticleSystem
    }
    createParticle(imgTex, capac, pos, spd, lifetime, minSize, maxSize, gravityY, particleType, willStart, emitterMesh, haveColor, haveScale){
        const myParticleSystem = new BABYLON.ParticleSystem(`particle.${makeRandNum()}`, capac)

        myParticleSystem.minEmitPower = 1
        myParticleSystem.maxEmitPower = 1
        switch(particleType){
            case "sphere":
                myParticleSystem.createSphereEmitter(1);
            break;
            case "cone":
                const radius = 2;
                const angle = Math.PI / 4;
                myParticleSystem.createConeEmitter(radius, angle);
            break
        }
        myParticleSystem.particleTexture = new BABYLON.Texture(`./images/particles/${imgTex}.png`, scene);
        if(pos) myParticleSystem.emitter = new Vector3(pos.x,pos.y,pos.z)
        if(emitterMesh) myParticleSystem.emitter = emitterMesh
        willStart ? myParticleSystem.start() : myParticleSystem.stop()

        myParticleSystem.updateSpeed = spd //0.05;
        myParticleSystem.minSize = minSize//0.2;
        myParticleSystem.maxSize = maxSize//0.9;
        myParticleSystem.gravity = new BABYLON.Vector3(0, gravityY, 0);
        
        myParticleSystem.minLifeTime = lifetime.min//0.3;
        myParticleSystem.maxLifeTime = lifetime.max//1.5;
 
        if(haveColor){
            switch(haveColor){
                case "red":
                    myParticleSystem.color1 = new BABYLON.Color4(0.95, 0, 0);
                    myParticleSystem.color2 = new BABYLON.Color4(0.72, 0.42, 0.09);
                    myParticleSystem.colorDead = new BABYLON.Color4(0.29, 0.01, 0, 0);
                break;
            }
            if(haveColor.r || haveColor.r === 0){
                const {r,g,b} = haveColor
                myParticleSystem.color1 = new BABYLON.Color4(r,g,b);
                myParticleSystem.color2 = new BABYLON.Color4(r+.2,g+.2,b+.2);
                myParticleSystem.colorDead = new BABYLON.Color4(r-.6,g-.6,b-.6);
            }
        }
        if(haveScale){
            myParticleSystem.minScaleX = haveScale.x
            myParticleSystem.maxScaleX = haveScale.x+.5

            myParticleSystem.minScaleY = haveScale.y
            myParticleSystem.minScaleY = haveScale.y+.5
        }
        return myParticleSystem
    }
    createOreXline(toClone,cloneName, from, randomNums, count, scene){

        for(var i = 0; i < count;i++){
            const oreId = Math.random().toString().split()[1]
            const randomX = Math.random() * randomNums.xRandom
            const randomZ = Math.random() * randomNums.zRandom
     
            const newX = from.xFrom + i + randomX
            const newZ = from.zFrom + randomZ
            const scaleR = .1 + Math.random() * .2

            const theClone = toClone.clone(`${cloneName}.${i}`)

            theClone.position = new Vector3(newX,0,newZ)
            theClone.rotation = new Vector3(0, Math.random() * 2,0)
            theClone.scaling = new Vector3(scaleR,scaleR,scaleR)

            theClone.actionManager = new ActionManager(scene)
            theClone.freezeWorldMatrix()
            this.Ores.push({oreId, mesh: theClone})
        }
    }
    createClone(meshClone, cloneName, pos, rotat, scene, isScaling){
        const newClone = meshClone.clone(`${cloneName}.${Math.random()}`)
        if(cloneName.includes("cliff")) newClone.checkCollisions = true

        const {x,y,z} = pos
        newClone.position = new Vector3(x,y,z)
        newClone.rotation = new Vector3(0,rotat,0)
        if(isScaling){
            newClone.scaling = new Vector3(isScaling.ran,isScaling.ran,isScaling.ran)
        }
        newClone.actionManager = new ActionManager(scene)

        newClone.freezeWorldMatrix()
        return newClone
    }
    createTable(toClone, pos, rotatY, chairMesh, platesMesh){
        const tabl = toClone.clone("table")
        tabl.position = new Vector3(pos.x,pos.y,pos.z)
        tabl.addRotation(0,rotatY,0)
        this.putFakeShadow(tabl, 4,.02)
        this.blocks.push(tabl)
        this.freeze(tabl)
        if(chairMesh){
            const clonedChair = chairMesh.clone("chair")
            clonedChair.parent = tabl
            clonedChair.position = new Vector3(0,0,1);
            
            this.toRegAction(this.myChar.bx, clonedChair, () => {
                this.openPopUpAction("chair")
                this.targetRecource = clonedChair
                const chairPos = clonedChair.getAbsolutePosition()
                this.targDetail = chairPos
            })
            this.toRegActionExit(this.myChar.bx, clonedChair, () => {
                this.closePopUpAction()
            })
            // other cloned chair
            const otherChair = chairMesh.clone("chair")
            otherChair.parent = tabl
            otherChair.position = new Vector3(0,0,-1);
            
            this.toRegAction(this.myChar.bx, otherChair, () => {
                this.openPopUpAction("chair")
                this.targetRecource = otherChair
                const chairPos = otherChair.getAbsolutePosition()
                this.targDetail = chairPos
            })
            this.toRegActionExit(this.myChar.bx, otherChair, () => {
                this.closePopUpAction()
            })
        }
    }
    createComplicatedIns(meshClone, cloneName, pos, rotat, scene, isScaling){
        const newClone = meshClone.createInstance(`${cloneName}.${Math.random()}`)
        if(cloneName.includes("cliff")) newClone.checkCollisions = true
        if(cloneName.includes("bigrock")) newClone.checkCollisions = true
        newClone.parent = null

        const {x,y,z} = pos
        newClone.position = new Vector3(x,y,z)
        newClone.rotation = new Vector3(0,rotat,0)
        if(isScaling){            
            newClone.scaling = new Vector3(isScaling.ran,isScaling.ran,isScaling.ran)
        }
        newClone.actionManager = new ActionManager(scene)
        newClone.freezeWorldMatrix()
        loadedMesh++
        return newClone
    }
    createNameDisplay(posY, theId, labelName, parentMesh, size, afterClick, widthSize){
        // name display
        const nameMesh = Mesh.CreatePlane(`plane.${theId}`, 3);
        
        nameMesh.billboardMode = Mesh.BILLBOARDMODE_ALL;
        const textureForName = GUI.AdvancedDynamicTexture.CreateForMesh(nameMesh);
        const nameText = GUI.Button.CreateSimpleButton(`nametag.${theId}`, labelName);

        nameText.height = 0.17;
        nameText.width = widthSize ? widthSize : 0.42;
        nameText.color = "white";
        nameText.fontSize = size;
        nameText.thickness = 0
        // nameText.background = "red";

        textureForName.addControl(nameText);

        nameMesh.parent = parentMesh
        nameMesh.position = new Vector3(0,posY,0)
        nameMesh.rotation = new Vector3(0,0,0)

        if(afterClick){
            nameText.onPointerDownObservable.add( () => afterClick())
        }
        return nameMesh
    }
    addToFloatingUp(meshDet){
        this.floatingMeshes.push(meshDet)
        setTimeout(() => {
            this.floatingMeshes = this.floatingMeshes.filter(flMesh => flMesh.capId !== meshDet.capId)
            meshDet.mesh.dispose()
        }, 2000)
    }
    createTextMesh(capId,textToDisplay, color, pos, fontSize, scene, isFloating, theParent){
        const nameMesh = Mesh.CreatePlane("textToDisplay", 5, scene);
        
        nameMesh.billboardMode = Mesh.BILLBOARDMODE_ALL;
        const textureForName = GUI.AdvancedDynamicTexture.CreateForMesh(nameMesh);

        var text1 = new GUI.TextBlock();
        text1.text = textToDisplay
        text1.color = color
        text1.fontSize = fontSize;
        textureForName.addControl(text1);    
        if(theParent) nameMesh.parent = theParent
        nameMesh.position = new Vector3(pos.x,pos.y,pos.z)

        isFloating && this.addToFloatingUp({capId: capId, mesh: nameMesh})
        
        return nameMesh
    }
    createMonsName(posY, theId, labelName, parentMesh){
        // name display
        const nameMesh = Mesh.CreatePlane(`nameMesh.${theId}`, 3);
        
        nameMesh.billboardMode = Mesh.BILLBOARDMODE_ALL;
        const textureForName = GUI.AdvancedDynamicTexture.CreateForMesh(nameMesh);
        const nameText = GUI.Button.CreateSimpleButton(`nametag.${theId}`, labelName);

        nameText.height = 0.9;
        nameText.color = "white";
        nameText.fontSize = 110;
        nameText.thickness = 0
        // nameText.background = "red";

        textureForName.addControl(nameText);

        nameMesh.parent = parentMesh
        nameMesh.position = new Vector3(0,posY,0)
        nameMesh.rotation = new Vector3(0,0,0)
        return nameMesh
    }
    createMonsHealthBar(posY, theId, parentMesh, hp, maxHp){
        const monsHealthPlane = Mesh.CreatePlane(`monsHp.${theId}`, 3);
        monsHealthPlane.position.y = posY;
        monsHealthPlane.billboardMode = Mesh.BILLBOARDMODE_ALL;
        const advancedTexture = GUI.AdvancedDynamicTexture.CreateForMesh(monsHealthPlane);
        const robHealthGui = GUI.Button.CreateSimpleButton("but1", " ");

        robHealthGui.height = .04; // .04
        robHealthGui.width = `${(parseInt(hp)/parseInt(maxHp) * 100) * 4}px`;
        robHealthGui.color = "white";
        robHealthGui.fontSize = 300;
        robHealthGui.background = "red";

        advancedTexture.addControl(robHealthGui);

        monsHealthPlane.parent = parentMesh
        return {robHealthGui, monsHealthPlane}
    }
    createPlayerHealthBar(posY, theId, parentMesh, hp, maxHp, scene){
        const playerHealthMesh = Mesh.CreatePlane(`playerHealth.${theId}`, 3, scene);
        playerHealthMesh.position.y = posY;
        playerHealthMesh.billboardMode = Mesh.BILLBOARDMODE_ALL;
        const advancedTexture = GUI.AdvancedDynamicTexture.CreateForMesh(playerHealthMesh);
        const lifeGui = GUI.Button.CreateSimpleButton("but1", " ");
        playerHealthMesh.visibility = .5

        lifeGui.height = .03; // .04
        lifeGui.width = `${(parseInt(hp)/parseInt(maxHp) * 100) * 2}px`;
        lifeGui.color = "white";
        lifeGui.fontSize = 300;
        lifeGui.background = "red";

        advancedTexture.addControl(lifeGui);

        playerHealthMesh.parent = parentMesh
        return {lifeGui, playerHealthMesh}
    }
    createBar(posY, heightBar, theId, parentMesh, currentLoad, maxLoad){
        const barMesh = Mesh.CreatePlane(`bar.${theId}`, 3);
        barMesh.position.y = posY;
        barMesh.billboardMode = Mesh.BILLBOARDMODE_ALL;
        const advancedTexture = GUI.AdvancedDynamicTexture.CreateForMesh(barMesh);
        barMesh.isVisible = false

        const bar = GUI.Button.CreateSimpleButton(`insidebar`, " ");
        bar.height = heightBar //.02; // .04
        bar.width = `${(0/parseInt(maxLoad) * 100) * 5}px`;
        bar.color = "white";
        bar.background = "white";
        bar.left = '1px'
        advancedTexture.addControl(bar);

        const outlineBar = GUI.Button.CreateSimpleButton("outlinebar", " ");
        outlineBar.height = heightBar + .02 //.02; // .04
        outlineBar.width = `300px`;
        outlineBar.color = "white";
        outlineBar.fontSize = 300;
        outlineBar.thickness = 5
        outlineBar.background = "transparent";
        advancedTexture.addControl(outlineBar);

        barMesh.parent = parentMesh
        return {bar, barMesh, outlineBar}
    }
    createAdventurerBoard(toClone, pos, rotatY){
        const topGuildBoard = toClone.clone("topAdventurers");
        topGuildBoard.parent = null
        topGuildBoard.position = new Vector3(pos.x,pos.y,pos.z)
        topGuildBoard.addRotation(0,rotatY,0);

        this.toRegAction(this.myChar.detector, topGuildBoard, async () => {
           await this.showAdventurerRecord()
        })
        this.toRegActionExit(this.myChar.detector, topGuildBoard, () => {
            topAdventurersCont.classList.add("my-stat-hidding")
         })
    }
    createPath(size, pos, scene){
        const path = MeshBuilder.CreateBox(`path`, {size}, scene)
        const theY = size/2
        const {x,z} = pos
        path.position = new Vector3(x,theY,z)
        path.isVisible = false

        path.actionManager = new ActionManager(scene)
        return path
    }
    createBlock(height, width,pos, rotateY,scene){
        const posY = height/2
        const theBlock = MeshBuilder.CreateBox(`block.${Math.random()}`, {width, depth: 1, height}, scene)
        theBlock.checkCollisions = true
        theBlock.position = new Vector3(pos.x,posY, pos.z)
        theBlock.rotation = new Vector3(0,rotateY,0)
        theBlock.isVisible = false
        theBlock.actionManager = new ActionManager(scene)
        this.blocks.push(theBlock)
        theBlock.freezeWorldMatrix(false)
        return theBlock
    }
    createDig(loc){
        if(!digMesh) return log("no dig mesh")
        const dig = digMesh.clone("bonfire")
        dig.parent = null
        dig.position = new Vector3(loc.x,0,loc.z)
        return dig
    }
    createBigTorch(toClone, pos, haveFire){
        const clonedTorch = toClone.createInstance("bigtorch", scene)
        clonedTorch.position = new Vector3(pos.x,pos.y,pos.z)
        this.blocks.push(clonedTorch);
        haveFire && this.craftBonFire({x: pos.x, y: 4.7, z: pos.z}, .5, false)
        this.putFakeShadow(clonedTorch, 4, .02)
        this.freeze(clonedTorch)
    }
    createWall(theHeight, theWidth, pos, uAndVscale, modeltex, rotatY, scene, putOnBlocks){
        const wall = MeshBuilder.CreateBox("wall", {depth: .5, height: theHeight, width: theWidth}, scene)
        wall.position = new Vector3(pos.x,pos.y,pos.z)

        const newMat = new StandardMaterial("wallMat", scene)
        const wallTex = new Texture(`./images/modeltex/${modeltex}`)
        
        wallTex.uScale = uAndVscale
        wallTex.vScale = uAndVscale
        newMat.diffuseTexture = wallTex
        wall.material = newMat
        if(rotatY) wall.rotation.y = rotatY
        wall.checkCollisions = true
        if(putOnBlocks) this.blocks.push(wall)
        return wall
    }
    createWoodFloor(scene, vScale, uScale, pos, widHeight){
        oldHouseMesh = MeshBuilder.CreateGround("house", { width: widHeight.w, height: widHeight.h}, scene)
        oldHouseMesh.position = new Vector3(pos.x,pos.y,pos.z)
        const oldHouseMat = new StandardMaterial("oldHouseMat", scene)
        const diffuseTex = new Texture("./images/modeltex/planks.jpg", scene)
        oldHouseMat.diffuseTexture = diffuseTex
        oldHouseMesh.material = oldHouseMat
        oldHouseMat.specularColor = new Color3(0,0,0)
        diffuseTex.vScale = vScale
        diffuseTex.uScale = uScale
    }
    craftBonFire(loc, scaling, createMud){
        if(!bonFireMesh) return log("no bonFireMesh origin")
        const fireSound = this._allSounds.bonfireSound.clone(`bonfireSound.${makeRandNum()}`)
        const stoneAndStick = bonFireMesh.clone("bonfire");
        stoneAndStick.parent = null
        fireSound.attachToMesh(stoneAndStick)
        const fireClone = fire.clone("fireclone")
        const smokeClone = smoke.clone("smokeClone")
        
        stoneAndStick.position = new Vector3(loc.x, loc.y ? loc.y : 0,loc.z)
        fireClone.emitter = stoneAndStick
        smokeClone.emitter = stoneAndStick
        this.toRegAction(this.myChar.detector, stoneAndStick, () => {
            this.targetRecource = stoneAndStick
            this.openPopUpAction('bonfire')
        })
        this.toRegActionExit(this.myChar.detector, stoneAndStick, () => {
            this.targetRecource = undefined
            this.closePopUpAction()
            displayElems([craftCont, cookCont], "none")
        })
        // if(pointLight){
        //     const cloneLight = pointLight.clone("clonedPL")
        //     const bonPos = stoneAndStick.position
        //     cloneLight.position = new Vector3(bonPos.x,2,bonPos.z)
        //     cloneLight.intensity = 100
        //     pLightz.push(cloneLight)
        // }
        fireSound.play()
        createMud && this.createDig(loc)
        const {x,y,z} = stoneAndStick.getAbsolutePosition()
        if(scaling) stoneAndStick.scaling = new Vector3(scaling,scaling,scaling)
    }
    craftBedLeave(loc, scene){
        if(!bedLeaveMesh) return log("bedleavemesh not ready")
        const bedleav = bedLeaveMesh.clone("bedleave");
        bedleav.parent = null
        bedleav.position = new Vector3(loc.x,loc.y,loc.z)

        this.toRegAction(this.myChar.bx, bedleav, () => {
            this.openPopUpAction("rest")
            this.targetRecource = bedleav;
            log("colliding with bedleave")
        })
        this.toRegActionExit(this.myChar.bx, bedleav, () => {
            this.closePopUpAction()
        })
    }
    putFakeShadow(meshBody, sizeShadow, posY){
        const newFakeShadow = fakeShadow.createInstance(`fakeShadow.${meshBody.name.split(".")[1]}`)
        newFakeShadow.parent = null
        newFakeShadow.rotationQuaternion = null;
        newFakeShadow.parent = meshBody
        newFakeShadow.position = new Vector3(0,-this.yPos+.03,0)
        if(posY) newFakeShadow.position = new Vector3(0,posY,0)
        if(sizeShadow) {
            newFakeShadow.scaling = new Vector3(sizeShadow,.1,sizeShadow)
        }
        return newFakeShadow
    }
    async createMerchant(scene, merchPos, merchTarg){
        const Merchant = await this.importMesh(scene, "./models/", "merchant.glb");
        Merchant.meshes[0].getChildren(merch => {
            if(merch.name === "bodyp") shadowGen.addShadowCaster(merch)
        })
        this.arrangeMesh(Merchant.meshes[0], merchPos, merchTarg, true);
       
        // MERCHANT COLLISION
        this.toRegAction(this.myChar.detector, Merchant.meshes[0], () => {
            this.openPopUpAction("speak")
            this.targetRecource = 'merchant'
            this.targDetail = toSell
        })
        this.toRegActionExit(this.myChar.detector, Merchant.meshes[0], () => {
            this.closePopUpAction()
            this.targetRecource = undefined
            this.targDetail = undefined
        })
    }
    async buildTreazure(scene){
        const TheTreaz = await this.importMesh(scene, "./models/", "treasure.glb")
        TheTreaz.meshes[1].parent = null
        treasure = TheTreaz.meshes[1]
        treasure.position = new Vector3(0,100,0)
        return TheTreaz
    }
    async createMagicCircle(scene){
        const MagCirc = await this.importMesh(scene, "./models/", "magCircle.glb")
        MagCirc.meshes[1].parent = null;
        const glowMat = new StandardMaterial("glowCircle", scene);
        glowMat.emissiveColor = new Color3(.09,.5,.2);
        MagCirc.meshes[1].material = glowMat;
        magicCircle = MagCirc.meshes[1]; magicCircle.parent = null
        magicCircle.rotation = new Vector3(Math.PI/2,0,0);
        magicCircle.isVisible = false
        magicCircle.visibility = .2
    }
    async createRuneRock(scene, pos, color){
        let healingInterval
        const rockId = makeRandNum()
        const Rock = await this.importMesh(scene, "./models/", "runeRock.glb")
        const meshs = Rock.meshes
        const rockGlowMat = new StandardMaterial("rockGlowMat", scene)
        rockGlowMat.emissiveColor = !color ? new Color3(1,1,1) : new Color3(color.r,color.g,color.b)
        meshs[3].material = rockGlowMat;
        meshs[0].position = new Vector3(pos.x,0,pos.z);
        meshs[0].scaling = new Vector3(.5,.5,.5)
        this.putFakeShadow(meshs[0], 7, .02)
        const rockDet = { rockRoot:meshs[0], rockMesh: meshs[1], rockCirc: meshs[2] , rockWords: meshs[3], }
        this.blocks.push(rockDet.rockMesh)
        rockDet.rockCirc.name = `rune.${rockId}`
        const runeParticle = this.createParticle("flare", 100, {...pos, y: 2.7}, .05, {min: 2, max: 3}, .09, .5, .3, "sphere", false, rockDet.rockMesh, color, false)
        
        this.toRegAction(this.myChar.detector, rockDet.rockMesh, () => {
            this.allRotating.push({mesh: rockDet.rockCirc, isForward: false, spd: .01})
            runeParticle.start()
            clearInterval(healingInterval)
            healingInterval = setInterval(() => {
                if(this.det.mp >= this.det.maxMp){
                    this.det.mp = this.det.maxMp
                    return
                }
                this.det.mp+=1
            }, 100)
        })
        this.toRegActionExit(this.myChar.detector, rockDet.rockMesh, () => {
            this.allRotating = this.allRotating.filter(rotM => rotM.mesh.name !== `rune.${rockId}`)
            runeParticle.stop()
            clearInterval(healingInterval)
        })
        return rockDet
    }
    createGround(scene, directory, size){
        const groundMat = new StandardMaterial("groundMat", scene)
        const groundMesh = MeshBuilder.CreateGround("ground", {width: size, height: size}, scene)
        const diffuseTex = new Texture(directory, scene)
        groundMat.diffuseTexture = diffuseTex
        groundMesh.material = groundMat

        groundMat.specularColor = new Color3(0,0,0)
        groundMesh.receiveShadows = true
        // loadingWhat = 'environment'
        // const Ground = await SceneLoader.ImportMeshAsync("", directory, meshName, scene)
        // Ground.meshes.forEach(ground => ground.receiveShadows = true)
        // Ground.meshes[1].name = "ground"
        // groundMat.freeze()
        // Ground.meshes[1].freezeWorldMatrix()
        return{groundMesh, diffuseTex}
    }
    createFireWithSmoke(scene){
        const fireSys = this.createPSystem(normalFireJson,scene)
        fireSys.pSystem.emitter = BonFire.meshes[0]

        const smokeSys = this.createSmoke(scene)
        smokeSys.emitter = BonFire.meshes[0]
        smokeSys.start()
    }
    activateGlow(intenz, scene){
        const gl = new BABYLON.GlowLayer("glow", scene);
        gl.intensity = intenz
    }
    async forestCreations(scene){
        await this.createBonFire(true, scene);

        const BedLeave = await this.importMesh(scene, "./models/", "bedleave.glb")
        bedLeaveMesh = BedLeave.meshes[1];

        const Dig = await this.importMesh(scene, "./models/", "dig.glb")
        digMesh = Dig.meshes[1];

        const Flower = await this.importMesh(scene, "./models/", "flower.glb")
        stamFlower = Flower.meshes[1];
        stamFlower.parent = null
        stamFlower.position = new Vector3(0,0,-30)

        const HerbLeaves = await this.importMesh(scene, "./models/", "herbleaves.glb");
        herbleaves = HerbLeaves.meshes[1];
        herbleaves.parent = null
        herbleaves.position = new Vector3(1,0,-24)

        const Tree = await this.importMesh(scene,"./models/", "tree.glb")
        wholeTree = Tree.meshes[1]
    }
    async outGateC(scene, pos){
        const Gate = await this.importMesh(scene, "./models/", "outgate.glb")
        Gate.meshes.forEach(gmesh => gmesh.name = 'cliff')
        Gate.meshes[0].position = new Vector3(pos.x,pos.y,pos.z)
        Gate.meshes[1].material.freeze();Gate.meshes[1].freezeWorldMatrix()
        
        this.blocks.push(Gate.meshes[1]);
    }
    async createBonFire(isFiring, scene){
        const BonFire = await this.importMesh(scene, "./models/", "bonfire.glb")
        BonFire.meshes.forEach(bf => bf.position.y += 100);

        if(isFiring){
            const normalFireJson = {"name":"CPU particle system","id":"default system","capacity":10000,"disposeOnStop":false,"manualEmitCount":-1,"emitter":[0,0,0],"particleEmitterType":{"type":"ConeParticleEmitter","radius":0.1,"angle":0.7853981633974483,"directionRandomizer":0,"radiusRange":1,"heightRange":1,"emitFromSpawnPointOnly":false},"texture":{"tags":null,"url":"https://assets.babylonjs.com/textures/flare.png","uOffset":0,"vOffset":0,"uScale":1,"vScale":1,"uAng":0,"vAng":0,"wAng":0,"uRotationCenter":0.5,"vRotationCenter":0.5,"wRotationCenter":0.5,"homogeneousRotationInUVTransform":false,"isBlocking":true,"name":"https://assets.babylonjs.com/textures/flare.png","hasAlpha":false,"getAlphaFromRGB":false,"level":1,"coordinatesIndex":0,"optimizeUVAllocation":true,"coordinatesMode":0,"wrapU":1,"wrapV":1,"wrapR":1,"anisotropicFilteringLevel":4,"isCube":false,"is3D":false,"is2DArray":false,"gammaSpace":true,"invertZ":false,"lodLevelInAlpha":false,"lodGenerationOffset":0,"lodGenerationScale":0,"linearSpecularLOD":false,"isRenderTarget":false,"animations":[],"invertY":true,"samplingMode":3,"_useSRGBBuffer":false},"isLocal":false,"animations":[],"beginAnimationOnStart":false,"beginAnimationFrom":0,"beginAnimationTo":60,"beginAnimationLoop":false,"startDelay":0,"renderingGroupId":0,"isBillboardBased":true,"billboardMode":7,"minAngularSpeed":0,"maxAngularSpeed":0,"minSize":0.1,"maxSize":0.1,"minScaleX":1,"maxScaleX":1,"minScaleY":1,"maxScaleY":1,"minEmitPower":2,"maxEmitPower":2,"minLifeTime":0.2,"maxLifeTime":0.23,"emitRate":90.02,"gravity":[0,0,0],"noiseStrength":[10,10,10],"color1":[0.40784313725490196,0.00392156862745098,0.00392156862745098,1],"color2":[0.43529411764705883,0.21176470588235294,0,1],"colorDead":[0.08627450980392157,0,0,1],"updateSpeed":0.008,"targetStopDuration":0,"blendMode":0,"preWarmCycles":0,"preWarmStepOffset":1,"minInitialRotation":0,"maxInitialRotation":0,"startSpriteCellID":0,"spriteCellLoop":true,"endSpriteCellID":0,"spriteCellChangeSpeed":1,"spriteCellWidth":0,"spriteCellHeight":0,"spriteRandomStartCell":false,"isAnimationSheetEnabled":false,"useLogarithmicDepth":false,"colorGradients":[{"gradient":0,"color1":[0.5098039215686274,0.341176470588237,0.011764705882352941,1],"color2":[0.807843137254902,0,0,1]},{"gradient":1,"color1":[0.5176470588235295,0.050980392156862744,0.00392156862745098,1],"color2":[0.34509803921568627,0.023529411764705882,0.023529411764705882,1]},{"gradient":1,"color1":[0.058823529411764705,0,0,1],"color2":[0.2,0,0,1]}],"sizeGradients":[{"gradient":0,"factor1":0.05,"factor2":0.09},{"gradient":0.14,"factor1":0.4,"factor2":0.3},{"gradient":1,"factor1":0.03,"factor2":0.04}],"textureMask":[1,1,1,1],"customShader":null,"preventAutoStart":false}

            const fireSys = this.createPSystem(normalFireJson,scene)
            fireSys.pSystem.emitter = BonFire.meshes[0]

            const smokeSys = this.createSmoke(scene)
            smokeSys.emitter = BonFire.meshes[0]
            smokeSys.start()

            fire = fireSys.pSystem
            smoke = smokeSys
        }
        bonFireMesh = BonFire.meshes[1]
        bonFireMesh.position.y += 20
        log("have created bonfire")
        return BonFire
    }
    async createInstances(meshName, count, from, until,scene){

        const {meshes} = await SceneLoader.ImportMeshAsync("", "./models/", `${meshName}.glb`, scene)
        // newMeshes[0].material.opacityTexture = null;
        // newMeshes[0].material.backFaceCulling = false;
        meshes[0].isVisible = true;
        meshes[0].position = new Vector3(0,0,0)

        const grass = BABYLON.Mesh.MergeMeshes([meshes[1], meshes[2]], true, true, undefined, false, true);
        grass.position = new Vector3(0,0,0)
        grass.freezeWorldMatrix();
        grass.material.freeze()
        // grass.doNotSyncBoundingInfo = true;

        for(var i = 0;i <= count;i ++){
            const newX = BABYLON.Scalar.RandomRange(from, until)
            const newZ = BABYLON.Scalar.RandomRange(from, until)
            const fins = new Matrix.Translation(newX,0,newZ);
            grass.thinInstanceAdd(fins)
            grass.thinInstanceSetMatrixAt(grass, fins)

            loadedMesh ++
        }
        meshes.forEach(mesh => mesh.dispose())
    }
    async createIns(meshName, pos, capac, xR, zR, posRand){
        const TinGrass = await this.importMesh(scene, "./models/", meshName)
        const tinG = TinGrass.meshes[1]; tinG.parent = null;

        tinG.position = new Vector3(pos.x, pos.y ,pos.z)
        for(var i = 0;i <= capac;i ++){
            const newX = BABYLON.Scalar.RandomRange(xR.xmin, xR.xmax)
            const newZ = BABYLON.Scalar.RandomRange(zR.zmin, zR.zmax)
            let newY = 0
            if(posRand) newY = BABYLON.Scalar.RandomRange(posRand.miny, posRand.maxy)
            const fins = new Matrix.Translation(newX,newY,newZ);
            tinG.thinInstanceAdd(fins)
            tinG.thinInstanceSetMatrixAt(tinG, fins);
            // this.freeze(newMesh)
        }
    }
    async importMesh(scene, directory, meshName, isNormalMesh){
        loadingWhat = `creating ${meshName.split(".")[0]} ..`
        const Model = await SceneLoader.ImportMeshAsync("", directory, meshName, scene)
        loadedMesh += 10
        
        let theModel
        if(isNormalMesh){
            theModel = Model.meshes[1];
            theModel.parent = null
            theModel.rotationQuaternion = null
        }else{
            theModel = Model
        }
        return theModel
    }
    // creartion from socket
    createTrap(playerId, magElement, posOfCircle, circDuration, dmg, timeOfRelease, numbersOfHits){
        const theElementColor = rgbColors.find(kolor => kolor.name === magElement)
        if(!theElementColor) return log('not found element')
        const theTrapCol = MeshBuilder.CreateBox("theTrapCol", { size: .5}, scene)
        theTrapCol.position = new Vector3(posOfCircle.x, .25, posOfCircle.z)
        theTrapCol.isVisible = false
        this.toRegAction(this.myChar.bx, theTrapCol, () => {
            
            this.createNewCircle(theElementColor.rgb, {x: 0, y: 0, z: 0}, posOfCircle, playerId, circDuration)
            switch(magElement){
                case "earth":
                    let startingRelease = timeOfRelease
                    for(var i = 0; i<=numbersOfHits;i++){
                        setTimeout(() => {
                            this.createSharpRock({...posOfCircle, y:-10}, this.myChar.bx.position, dmg, true)
                        }, startingRelease)
                        startingRelease+=2000
                    }
                    this.createTextMesh(makeRandNum(), "Trap Detected", "red", this.myChar.bx.position, 100, this._scene, true, false)
                break
            }
        })
    }
    createFloor(directory, scene, pos, willReceiveShadow, hAw, posYofTile){
        const gMat = new StandardMaterial("grMat", scene)
        gMat.diffuseTexture = new BABYLON.Texture(directory, scene)
        const boxGround = MeshBuilder.CreateGround("groundbox", {height: hAw ? hAw.h : 5, width: hAw ? hAw.w : 5}, scene);
        boxGround.material = gMat
        boxGround.position = new Vector3(pos.x,posYofTile ? posYofTile : .01,pos.z);
        gMat.specularColor = new Color3(0,0,0);
        gMat.diffuseTexture.hasAlpha = true;
        gMat.useAlphaFromDiffuseTexture = true;
        boxGround.receiveShadows = willReceiveShadow
        
        boxGround.freezeWorldMatrix()
        boxGround.material.freeze()
        return boxGround
    }
    createHouse(meshId, houseNo, toClone, loc, scene, rotat, houseDet){
        const newHouse = toClone.clone(`house.${meshId}`)
        
        newHouse.parent = null
        newHouse.position = new Vector3(loc.x,loc.y,loc.z)
        newHouse.scaling = new Vector3(1,1,1)
        newHouse.material.specularColor = new Color3(0,0,0)
        if(rotat) newHouse.rotation = new Vector3(0,rotat,0)
        shadowGen.addShadowCaster(newHouse)
        newHouse.actionManager = new ActionManager(scene)
        this.toRegAction(newHouse, this.myChar.bx, () => {
            const myOwn = houzess.find(puno => puno.meshId === meshId)
            if(!myOwn) return log('not bumping... meshId not found on this.housez')
            this.disableMoving()
            this.stopPress()              
            this.bump(this.myChar)
            const mypos = this.myChar.bx.position

            this.socketAvailable && this.socket.emit('userBump', {_id: this.det._id, pos:{ x: mypos.x, z: mypos.z }, 
            dirTarg: {x: this.btf.position.x, z: this.btf.position.z} })

            setTimeout(() => this.allCanPress(), 1500)
        })
        this.toRegAction(this.myChar.detector, newHouse, () => {
            const myOwn = houzess.find(puno => puno.meshId === meshId)
            if(!myOwn) return log('not bumping... meshId not found on this.housez')
            if(myOwn.occupiedBy === this.det.name){
                this.openPopUpAction("key")
                this.targetRecource = 'myapartment'
                this.targDetail = myOwn.houseNo
                return
            }else{
                this.openPopUpAction("info")
                this.targetRecource = 'apartment'
                const percent = myOwn.houseNo === 0 ? 1000 : (2000 * parseInt(houseNo)) + (1000 *parseInt(houseNo)*.5)
                const apartmentNames = ['Armys Apartment', 'Classy Appartment']
                this.targDetail = {
                    houseNo: myOwn.houseNo,
                    name: apartmentNames[myOwn.houseNo],
                    price: percent,
                    rentPrice: percent/10,
                    occupiedBy: myOwn.occupiedBy
                }
            }
        })
        this.toRegActionExit(this.myChar.detector, newHouse, () => {
            this.closePopUpAction()
            this.targetRecource = undefined
            this.targDetail = undefined
            apartCont.style.display = "none"
        })
    
        newHouse.checkCollisions = true
        newHouse.freezeWorldMatrix()
        newHouse.material.freeze()
    }
    async createImportantHouse(modelName, pos, doorPos, rotatY, scene){
        const ImportantHouse = await this.importMesh(scene, "./models/", modelName)
        const impHouse = ImportantHouse.meshes[1];
        impHouse.parent = null;
        impHouse.rotationQuaternion = null
        if(rotatY) impHouse.addRotation(0,rotatY,0)
        // TheGuildHL.meshes[0].dispose();
        impHouse.checkCollisions = true
        impHouse.position = new Vector3(pos.x,pos.y,pos.z);
        const entrance = MeshBuilder.CreateGround(modelName.split(".")[0], {height: 3, width: 2}, scene)
        entrance.position = new Vector3(doorPos.x,doorPos.y,doorPos.z);
        entrance.visibility = false
        return {impHouse, entrance}
    }
    async createTavern(scene){
        const Tavern = await this.importMesh(scene, "./models/", "hl_club.glb")
        Tavern.meshes[0].position = new Vector3(40,0,16.6)
        Tavern.meshes[0].rotationQuaternion = null
        const tvrnBlock = MeshBuilder.CreateBox('tvrnCol', { width: 8, depth: 5, height: 1}, scene);
        tvrnBlock.position = new Vector3(40,0,17);
        tvrnBlock.isVisible = false
        this.blocks.push(tvrnBlock)
        this.putFakeShadow(tvrnBlock, 10, .02)
        Tavern.meshes.forEach(tvrn => {
            if(tvrn.name.includes("root")) return
            this.freeze(tvrn)
        })
        
        return Tavern
    }
    createOre(mesh, data){
        const newOre = mesh.clone(`iron.${data.meshId}`)

        const posArr = data.pos.split(",")
        newOre.position = new Vector3(posArr[0],0,posArr[1])

        this.toRegAction(this.myChar.detector, newOre, () => {
            const myOwn = this.Ores.find(ore => ore.meshId === data.meshId)
            if(!myOwn) return
            this.openPopUpAction("mine")
            this.targetRecource = newOre
        })

        this.myChar.detector.actionManager.registerAction(new ExecuteCodeAction(
            {
                trigger: ActionManager.OnIntersectionExitTrigger,
                parameter: newOre
            }, e => {
                this.closePopUpAction()
                this.targetRecource = undefined
            }
        ))
        this.myChar.bx.actionManager.registerAction(new ExecuteCodeAction(
            {
                trigger: ActionManager.OnIntersectionEnterTrigger,
                parameter: newOre
            }, e => {
                const myOwn = this.Ores.find(ore => ore.meshId === data.meshId)
                if(!myOwn) return
                this.bump(this.myChar)
            }
        ))
        this.myChar.soundColl.actionManager.registerAction(new ExecuteCodeAction(
            {
                trigger: ActionManager.OnIntersectionEnterTrigger,
                parameter: newOre
            },e => {
               if(this.myChar._minning){
                    this.myChar.minningS.setPlaybackRate(1+Math.random()*.3)
                    this.myChar.minningS.play()
               }
            }
        ))

        newOre.freezeWorldMatrix();
        this.Ores.push({...data, body: newOre})
    }
    createTree(theMesh, data, scene){
        
        const newTree = theMesh.clone(`trees.${data.meshId}`)
        const ramScale = 1 + Math.random() * .3;
        const newPlane = MeshBuilder.CreateBox(`trees.${data.meshId}.wood`, {height:5, width: ramScale-.6, depth: ramScale-.6}, scene)
        newPlane.isVisible = false
        newTree.scaling = new Vector3(ramScale,ramScale,ramScale)

        const posArr = data.pos.split(",")

        newPlane.position = new Vector3(parseInt(posArr[0]),0,parseInt(posArr[1]))
        newTree.parent = newPlane;
        const {x,z} = newPlane.position
        this.createDig({x,z});

        const smokePrtcle = this.createSmoke(scene, (partcle) => {
            partcle.emitRate = 30
            partcle.createSphereEmitter(1);
            partcle.updateSpeed = .06
            partcle.emitter = newPlane
        });
        smokePrtcle.targetStopDuration = 1.5
        this.myChar.detector.actionManager.registerAction(new ExecuteCodeAction(
            {
                trigger: ActionManager.OnIntersectionEnterTrigger,
                parameter: newPlane
            }, e => {
                const myOwn = this.Trees.find(puno => puno.meshId === data.meshId)
                if(!myOwn) return
                this.openPopUpAction("axe")
                this.targetRecource = newPlane
            }
        ))
        this.myChar.detector.actionManager.registerAction(new ExecuteCodeAction(
            {
                trigger: ActionManager.OnIntersectionExitTrigger,
                parameter: newPlane
            }, e => {
                this.closePopUpAction()
                this.targetRecource = undefined
            }
        ))
        this.myChar.bx.actionManager.registerAction(new ExecuteCodeAction(
            {
                trigger: ActionManager.OnIntersectionEnterTrigger,
                parameter: newPlane
            },e => {
                const myOwn = this.Trees.find(puno => puno.meshId === data.meshId)
                if(!myOwn) return log("tree id not found")
                this.disableMoving()
                this._canpress = false
                canPress = false                
                this.bump(this.myChar)
                const mypos = this.myChar.bx.position
                this.socketAvailable && this.socket.emit('userBump', {_id: this.det._id, pos:{ x: mypos.x, z: mypos.z }, 
                dirTarg: {x: this.btf.position.x, z: this.btf.position.z} })
                setTimeout(() => this.allCanPress(), 1000)
            }
        ))
        this.myChar.soundColl.actionManager.registerAction(new ExecuteCodeAction(
            {
                trigger: ActionManager.OnIntersectionEnterTrigger,
                parameter: newPlane
            },e => {
               if(this.myChar._training){
                    this.myChar.woodCuttingS.setPlaybackRate(.9+Math.random()*.3)
                    this.myChar.woodCuttingS.play()
                    smokePrtcle.start()
                }
            }
        ))

        newTree.freezeWorldMatrix();
        newTree.material.freeze()
        this.Trees.push({...data, body: newPlane})
    }
    createTreasure(theMesh, data){
        const newTreasure = theMesh.clone(`treasure.${data.meshId}`)
        
        newTreasure.position = new Vector3(data.x,0,data.z)
        const hits = 300

        this.myChar.detector.actionManager.registerAction(new ExecuteCodeAction(
            {
                trigger: ActionManager.OnIntersectionEnterTrigger,
                parameter: newTreasure
            }, e => {
                log(this.Treasures)
                log(data.meshId)
                const myOwn = this.Treasures.find(treasure => treasure.meshId === data.meshId)
                if(!myOwn) return log('cant find treasure')
                if(myOwn.isOpening) return log('someone is opening')

                const itemRec = records.find(rec => rec.name === myOwn.name)
                if(!itemRec) return log('rec item not found')

                this.myLoadingBarMax = parseInt(hits)
                this.myLoadingBarMin = 0
                this.myBar.outlineBar.width = `${this.myLoadingBarMax}px`

                this.targetRecource = newTreasure
                this.targDetail = {...data, itemType: itemRec.itemType}
                log(this.targDetail)
                this.openPopUpAction('pickup')
            }
        ))
        this.myChar.detector.actionManager.registerAction(new ExecuteCodeAction(
            {
                trigger: ActionManager.OnIntersectionExitTrigger,
                parameter: newTreasure
            }, e => {
                this.closePopUpAction()
                this.targetRecource = undefined
                this.targDetail = undefined
                this.myBar.bar.width = `0px`
                this.myBar.barMesh.isVisible = false
                this.closePopUpAction()
            }
        ))
        this.Treasures.push({...data,body:newTreasure, isOpening: data.isOpening, openingBy:data.openingBy })

        this.freeze(newTreasure)
    }
    createFlower(theMesh, data){
        const newMesh = theMesh.clone(`flower.${data.meshId}`)
        newMesh.position = new Vector3(data.pos.x,0,data.pos.z)
        newMesh.rotation = new Vector3(0,Math.random()*4,0)

        this.myChar.detector.actionManager.registerAction(new ExecuteCodeAction(
            {
                trigger: ActionManager.OnIntersectionEnterTrigger,
                parameter: newMesh
            }, e => {
                const myOwn = this.AllFlowerz.find(treasure => treasure.meshId === data.meshId)
                if(!myOwn) return log('cant find flower')

                const itemRec = records.find(rec => rec.name === myOwn.name)
                if(!itemRec) return log('rec item not found')

                this.targetRecource = newMesh
                this.targDetail = {...data, price: itemRec.secondPrice, itemType: itemRec.itemType}
                log(this.targDetail)
                this.openPopUpAction('pickup')
            }
        ))
        this.myChar.detector.actionManager.registerAction(new ExecuteCodeAction(
            {
                trigger: ActionManager.OnIntersectionExitTrigger,
                parameter: newMesh
            }, e => {
                this.closePopUpAction()
                this.targetRecource = undefined
                this.targDetail = undefined
                this.closePopUpAction()
            }
        ))
        this.AllFlowerz.push({...data,body:newMesh})
        this.freeze(newMesh)
    }
    createCrystal(crysId, mesh, crystalName, pos, hits, rotat, scene, isScale){
        
        const theCrystal = mesh.clone(`crystal.${crystalName}.${crysId}`)
        theCrystal.rotationQuaternion = null
        theCrystal.position = new Vector3(pos.x,-.1,pos.z)
        theCrystal.rotation.y = rotat
        if(isScale) theCrystal.scaling = new Vector3(isScale,isScale,isScale)
        theCrystal.actionManager = new ActionManager(scene)

        this.Crytalz.push({mesh:theCrystal, meshId: crysId, hits, name: crystalName})

        return theCrystal
    }
    placeSword(swordDet, sword, swordSize, scene){
        log(swordDet)
        let isGlowing = false
        if(sword.name.includes("glow")) isGlowing = true

        const mesh = sword.clone(`sword.${swordDet.meshId}`)
        mesh.parent = null
        mesh.isVisible = true
        const {x,z} = swordDet
        mesh.position = new Vector3(x,.9,z)
        mesh.rotationQuaternion = null
        mesh.rotation = new Vector3(0,0,0)
        mesh.addRotation(-Math.PI,0,0)

        mesh.scaling = new Vector3(swordSize,swordSize,swordSize)
        mesh.actionManager = new ActionManager(scene)
        const newSwordToPick = {...swordDet, qnty: 1}
        if(isGlowing){
            const newMesh = MeshBuilder.CreateBox("forGlowingSword", {size: 1}, scene)
            
            newMesh.actionManager = new ActionManager(scene)
            newMesh.parent = mesh
            newMesh.position.y+=1
            
            newMesh.actionManager.registerAction(new ExecuteCodeAction(
                {
                    trigger: ActionManager.OnIntersectionEnterTrigger,
                    parameter: this.myChar.detector
                }, e => {        
                    this.openPopUpAction("pickup")
                    this.targetRecource = mesh
                    this.targDetail = newSwordToPick
                    log(this.targDetail)
                }
            ))
            newMesh.actionManager.registerAction(new ExecuteCodeAction(
                {
                    trigger: ActionManager.OnIntersectionExitTrigger,
                    parameter: this.myChar.detector
                }, e => {               
                    this.closePopUpAction()
                    this.targetRecource = undefined
                    this.targDetail = undefined
                }
            ))
            mesh.getChildren().forEach(mes => mes.isVisible = true)
            newMesh.isVisible = false
        }else{
            mesh.actionManager.registerAction(new ExecuteCodeAction(
                {
                    trigger: ActionManager.OnIntersectionEnterTrigger,
                    parameter: this.myChar.detector
                }, e => {            
                    this.openPopUpAction("pickup")
                    this.targetRecource = mesh
                    this.targDetail = newSwordToPick
                    log(this.targDetail)
                }
            ))
            mesh.actionManager.registerAction(new ExecuteCodeAction(
                {
                    trigger: ActionManager.OnIntersectionExitTrigger,
                    parameter: this.myChar.detector
                }, e => {               
                    this.closePopUpAction()
                    this.targetRecource = undefined
                    this.targDetail = undefined
                }
            ))
        }
        log(newSwordToPick)
        this.lootz.push({...newSwordToPick, body: mesh})
        log("All lootz ", this.lootz)
    }
    struckTheSword(player, swordMesh){
        player.spearStruck.play()
        swordMesh.isVisible = false
        this.hideAllSword(swordMesh.getChildren())
        player.rootSword.addRotation(-Math.PI,0,0)
        this.keepSword(player.rootSword, player.rootBone)
    }
    createSeed(theMesh, data){
        const theObjModel = theMesh.clone(`${data.spawntype}.${data.meshId}`)
        const ramScale = 1.3 + Math.random() * .5
        theObjModel.freezeWorldMatrix()

        theObjModel.scaling = new Vector3(ramScale,ramScale,ramScale)
        theObjModel.rotation.y = Math.random() * 2.5

        const posArr = data.pos.split(",")

        theObjModel.position = new Vector3(posArr[0],0,posArr[1])

        switch(data.spawntype){
            case "seed":
                const {meshId, spawntype, place,pos,hits} = data
                this.Seedz.push({meshId, spawntype, place,pos,hits, owner: data._id})
            break
        }
        theObjModel.material.freeze()
        theObjModel.freezeWorldMatrix()
    }
    createMonsterToChase(mons, monsName, pos, size, rotat, scene ){
        const monsCollision = MeshBuilder.CreateBox('monsCollision', {width: size.width, height: 1, depth: 1}, scene)
        monsCollision.position = new Vector3(pos.x, .5, pos.z)
        monsCollision.rotation.y = rotat
        monsCollision.isVisible = false

        monsCollision.actionManager = new ActionManager(scene)
        monsCollision.actionManager.registerAction(new ExecuteCodeAction(
            {
                trigger: ActionManager.OnIntersectionEnterTrigger,
                parameter: this.myChar.bx
            }, e => {
                if(this.currentPlace.includes("dungeon")){
                    this._allSounds.suspense1.attachToMesh(this.myChar.bx)
                    this._allSounds.suspense2.attachToMesh(this.myChar.bx)

                    if(Math.random() > .5){
                        this._allSounds.suspense1.play()
                    }else{
                        this._allSounds.suspense2.play()
                    }
                }
                mons.forEach(mon => {
                    if(mon.monsName === monsName){
                        if(Math.random() > .7){
                            mon.targHero = this.det._id
                            mon.isChasing = true
                        }
                    }
                })
                this.disposeActionM(monsCollision)
                this.disposeMeshes([monsCollision], 500)
            }
        ))
    }
    createCharacter(det, theCharacterRoot, scene, shadowGen, castShadow, isMine, allswords, allhelmets, allshields, light, detectorSize){
        const body = MeshBuilder.CreateBox(`box.${det._id}`, {size: .2, height: 1.7}, scene)
        body.position = new Vector3(det.x,this.yPos,det.z); 
        body.checkCollisions = true
        // body.onCollide = m => {
        //     log(m.name)
        //     if(m.name.includes("trees") || m.name.includes("wall")) log("walking on wall")
        // }
        const detector = MeshBuilder.CreateBox(`detector.${det._id}`, {size: detectorSize, height: 1}, scene)
        detector.position = new Vector3(0,-.45,0); detector.visibility = .7
        detector.parent = body;

        const swordSlash = this.createSwordSlash(scene, det._id, rgbColors[0].rgb)

        body.isVisible = false
        detector.isVisible = false
        if(fakeShadow) this.putFakeShadow(body)
        let entries = theCharacterRoot.instantiateModelsToScene();
        entries.animationGroups.forEach(ani => ani.name = ani.name.split(" ")[2])
        let meshes = []
        let rHead;
        entries.rootNodes[0].getChildren().forEach(mes => {
            mes.name = mes.name.split(" ")[2]
            if(mes.name !== "Armature") meshes.push(mes);
            if(mes.name === "Armature"){
                mes.getChildren().forEach(mes => {
                    if(mes.name.includes("rbone")) rHead = mes.getChildren()[0].getChildren()[0].getChildren()[0]
                })     
            }
        })
        const {lifeGui, playerHealthMesh} = this.createPlayerHealthBar(1.1,det._id,body, det.hp,det.maxHp, scene)

        entries.rootNodes[0].parent = body
        entries.rootNodes[0].position.y -= this.yPos
        entries.rootNodes[0].rotationQuaternion = null
        entries.skeletons[0].dispose()

        const theHair = this.suitUpdate(meshes, det.hair, det.cloth, det.pants, det.boots, det.hairColor, scene, light)
        const nameMesh = this.createTextMesh(makeRandNum(),det.name, "white",{x: 0, y:1.5, z:0},50, scene, false, body)

        let camTarg
        let weaponCol
        let farDetector
        if(isMine){
            camTarg = MeshBuilder.CreateBox(`camTarg.${det._id}`, { size: .5 }, scene)
            camTarg.parent = body
            camTarg.isVisible = false
            camTarg.position = new Vector3(0,.7,0);
            // light.parent = camTarg;
            
            this.myBar = this.createBar(1.4,.04, det._id, body, 0, 300)

            weaponCol = MeshBuilder.CreateBox(`weaponCol.${det._id}`, { size: .6, depth: 1.2 }, scene)
            weaponCol.position = new Vector3(0,1,.8); 
            weaponCol.parent = body
            weaponCol.actionManager = new ActionManager(scene)
            weaponCol.isVisible = false
            const {hungryS,eatSolidS, enemyEncounter, upgradeS,enteredS,enteringHoleS, merchantV,normalV, smallCongratsS,brokenS, notifS,changeModeS,skillAcquiredS,consumeS,itemEquipedS, coinReceivedS, nextBtnS, congratsS} = this._allSounds
            
            hungryS.attachToMesh(body)
            enemyEncounter.attachToMesh(body)
            eatSolidS.attachToMesh(body)
            changeModeS.attachToMesh(body)
            skillAcquiredS.attachToMesh(body)
            consumeS.attachToMesh(body)
            itemEquipedS.attachToMesh(body)
            coinReceivedS.attachToMesh(body)
            nextBtnS.attachToMesh(body)
            notifS.attachToMesh(body)
            congratsS.attachToMesh(body)
            brokenS.attachToMesh(body)
            smallCongratsS.attachToMesh(body)
            merchantV.attachToMesh(body)
            normalV.attachToMesh(body);
            upgradeS.attachToMesh(body);
            enteredS.attachToMesh(body);
            enteringHoleS.attachToMesh(body);

            farDetector = MeshBuilder.CreateGround(`farDetector.${det._id}`, {width: 25, height: 25}, scene)
            farDetector.position = new Vector3(0,0,0); 
            farDetector.isVisible = false
            farDetector.parent = body

            detector.actionManager = new ActionManager(scene)
            farDetector.actionManager = new ActionManager(scene)
            body.actionManager = new ActionManager(scene)
        }
        const myswordz = []
        const myhelmetz = []
        const myshieldz = []
        const armorz = []
        const gearz = []
        let rHand
        let lHand
        let rootBone
        const rootSword = MeshBuilder.CreateBox(`rootsword.${det._id}`, {size: .5}, scene)
        rootSword.isVisible = false;
        const soundColl = MeshBuilder.CreateBox(`soundColl.${det._id}`, {height: 4, size: .3}, scene)
        soundColl.parent = rootSword; 
        soundColl.position = new Vector3(0,3.5,0)
 
        soundColl.actionManager = new ActionManager(scene)
        soundColl.isVisible = false

        const whoopS = this._allSounds.whoop.clone()
        const drawSwordS = this._allSounds.drawSword.clone()
        let runningS = this._allSounds.running.clone()
        const minningS = this._allSounds.minning.clone()
        const punchedS = this._allSounds.punched.clone()
        const sliceHitS = this._allSounds.sliceHit.clone()
        const woodCuttingS = this._allSounds.woodCuttingS.clone()
        const diedS = this._allSounds.characDeathS.clone()
        const spearStruck = this._allSounds.spearStruckS.clone();

        // create blood splat
        const bloodSplat = this.createBloodParticle("blood", 50, false, "sphere", false, 1, false, body)
        runningS.attachToMesh(body)
        punchedS.attachToMesh(body)
        sliceHitS.attachToMesh(body)
        whoopS.attachToMesh(rootSword)
        drawSwordS.attachToMesh(rootSword)
        minningS.attachToMesh(rootSword)
        woodCuttingS.attachToMesh(rootSword)
        spearStruck.attachToMesh(body)

        const isOnFloorPlace = this.floorPlaces.some(placeName => this.currentPlace.includes(placeName))
        if(isOnFloorPlace){
            log("is in floor places")
            runningS = this._allSounds.woodFloorS.clone()
            runningS.attachToMesh(body)
        }        
        meshes.forEach(mesh => {
            if(mesh.name.includes('armor')) armorz.push(mesh)            
            if(mesh.name.includes('gear')) gearz.push(mesh)
        })
        entries.rootNodes[0].getChildren()[0].getChildren().forEach(mesh => {
            if(mesh.name.includes("rbone")){
               rHand = mesh.getChildren()[0].getChildren()[0].getChildren()[2].getChildren()[0].getChildren()[0].getChildren()[0]
               lHand = mesh.getChildren()[0].getChildren()[0].getChildren()[1].getChildren()[0].getChildren()[0].getChildren()[0]
               rootBone = mesh.getChildren()[0]
            }
        })
        let rootMesh = MeshBuilder.CreateBox(`rootMesh.${det._id}`, { height: 6, size: 2}, scene)
        rootMesh.parent = rootBone
        rootMesh.isVisible = false
        // WING CREATION
        let wingMeshes = []
        let wingAnims = []
        
        const { wingAnimas, figureMeshes } = this.transformInto(scene,det._id,det.race, rootMesh, rHead, meshes)
        wingMeshes = figureMeshes
        wingAnims = wingAnimas

        let liquorMug
        if(mugMesh){
            const mugClone = mugMesh.clone(`mug.${det._id}`)
            mugClone.rotationQuaternion = null;
            mugClone.parent = rHand;
            mugClone.position = new Vector3(0,0,0)
            mugClone.scaling = new Vector3(4.5,4.5,4.5)
            mugClone.isVisible = false
            liquorMug = mugClone
        }
        this.showArmor(armorz, det.armor.name);
        this.showArmor(gearz, det.gear.name);
        allswords.forEach(sword => {
            det.items.forEach(item => {
                if(item.itemType === 'sword'){
                    if(sword.name.split(".")[1] === item.name){
                        const isCreatedWithSameName = myswordz.some(swrd =>swrd.name.split(".")[1] === item.name)
                        if(isCreatedWithSameName) return log("is already created")
                        const swordCloned = sword.clone(`${sword.name}`)
                        swordCloned._id = makeRandNum()
                        swordCloned.parent = rootSword
                        swordCloned.position = new Vector3(0,0,0);
                        myswordz.push(swordCloned);
                    }
                }
            })
        })
        allhelmets.forEach(helm => {
            if(helm.name.includes("horns")) return
            det.items.forEach(item => {
                if(item.itemType === 'helmet'){
                    if(helm.name.split(".")[1] === item.name){
                        const isCreatedWithSameName = myhelmetz.some(swrd =>swrd.name.split(".")[1] === item.name)
                        if(isCreatedWithSameName) return log("helmet already created")
                        const clonedHelmet = helm.clone(`${helm.name}`)
                        clonedHelmet.parent = rHead
                        clonedHelmet.position = new Vector3(0,0,0);
                        myhelmetz.push(clonedHelmet)
                    }
                }
            })
        })
        allshields.forEach(shld => {
            det.items.forEach(item => {
                if(item.itemType === 'shield'){
                    if(shld.name.split(".")[1] === item.name){
                        const isCreatedWithSameName = myshieldz.some(swrd =>swrd.name.split(".")[1] === item.name)
                        if(isCreatedWithSameName) return log("shield already created")
                        const clonedShield = shld.clone(`${shld.name}`)
                        clonedShield.parent = lHand
                        clonedShield.position = new Vector3(0,0,0);
                        myshieldz.push(clonedShield)
                    }
                }
            })
        })

        const createSword = (swordName) => {
            allswords.forEach(sword => {
                if(sword.name.split(".")[1] === swordName){
                    log("we will create this sword")
                    const swordCloned = sword.clone(sword.name)
                    const isAlreadyHave = myswordz.some(swrd => swrd.name === swordName)
                    if(isAlreadyHave) return log("already have this mesh created in my swords meshes")
                    swordCloned.parent = rootSword
                    swordCloned.isVisible = true
                    swordCloned.rotationQuaternion = null
                    swordCloned.position = new Vector3(0,0,0)
                    myswordz.push(swordCloned)
                }
            })
            return myswordz
        }

        const createHelm = (helmetName) => {
            allhelmets.forEach(helmt => {
                if(helmt.name.split(".")[1] === helmetName){
                    log(`we will create ${helmt.name} helmet`)
                    const clonedHelm = helmt.clone(helmt.name)
                    const isAlreadyHave = myhelmetz.some(swrd => swrd.name === helmetName)
                    if(isAlreadyHave) return log("already have this mesh created in my helmets meshes")
                    clonedHelm.parent = rHead
                    clonedHelm.position = new Vector3(0,0,0);
                    myhelmetz.push(clonedHelm)
                    myhelmetz.forEach(helmt => log(helmt.name))
                }
            })
            return myhelmetz
        }
        const createShield = (shieldName) => {
            allshields.forEach(shld => {
                if(shld.name.split(".")[1] === shieldName){
                    log(`we will create ${shld.name} shield`)
                    const clonedShield = shld.clone(shld.name)
                    const isAlreadyHave = myhelmetz.some(swrd => swrd.name === shieldName)
                    if(isAlreadyHave) return log("already have this mesh created in my shields meshes")
                    clonedShield.parent = lHand
                    clonedShield.position = new Vector3(0,0,0)
                    myshieldz.push(clonedShield)
                }
            })
            return myshieldz
        }
        // if(det.weapon.name !== 'none'){
        //     myswordz.forEach(swordmesh =>{
        //         log(swordmesh.name)
        //         if(swordmesh.name.split(".")[1] === det.weapon.name){
        //             swordmesh.isVisible = true
        //         }else{
        //             swordmesh.isVisible = false
        //         }
        //     })
        // }else{
        //     myswordz.forEach(swordmesh =>swordmesh.isVisible = false)
        // }
        this.makeSwordVisible(myswordz, det.weapon.name)
        if(det.helmet.name !== 'none'){
            myhelmetz.forEach(swordmesh =>{
                log(swordmesh.name)
                if(swordmesh.name.split(".")[1] === det.helmet.name){
                    swordmesh.isVisible = true
                }else{
                    swordmesh.isVisible = false
                }
            })
        }else{
            myhelmetz.forEach(swordmesh =>swordmesh.isVisible = false)
        }
        if(det.shield.name !== 'none'){
            myshieldz.forEach(swordmesh =>{
                if(swordmesh.name.split(".")[1] === det.shield.name){
                    swordmesh.isVisible = true
                }else{
                    swordmesh.isVisible = false
                }
            })
        }else{
            myshieldz.forEach(swordmesh =>swordmesh.isVisible = false)
        }

        // const rockParticles = this.createBloodParticle("rocktexture", 10, false, "sphere", true, false, false, soundColl)
        const toPush = {
            _id: det._id,
            name: det.name,
            bx: body,
            swordSlash,
            detector,
            farDetector,
            _moving: false,
            _attacking: false,
            _minning: det._minning ? det._minning : false,
            _training: det._training ? det._training : false,
            _crafting: det._crafting ? det._crafting : false,
            _casting: false,
            mode: det.mode === undefined ? 'stand' : det.mode,
            status: [], // bashed(will be moved backwards)
            moveActionName: "none",
            spd: det.stats.spd,
            dirTarg: {x: 0, z: -1},
            anims: entries.animationGroups,
            wingAnims,
            meshes,
            soundColl,
            myhelmetz,
            myshieldz,
            swordz: myswordz, rootMesh, rHand, lHand, rootBone, rootSword, rHead, theHair,
            createSword, createHelm, createShield,
            armorz, gearz,
            lifeGui,
            playerHealthMesh,
            nameMesh,
            whoopS,
            drawSwordS,
            runningS,
            minningS,
            punchedS,
            sliceHitS,
            woodCuttingS,
            spearStruck,
            diedS,
            bloodSplat,
            inVulnerable: false,
            prevMode: "fist",
            liquorMug
        }
        
        this.playAnim(toPush.anims, "0Idle", true)
        if(det.mode === "weapon") this.getSword(rootSword, rHand)
        if(det.mode === "fist") this.keepSword(rootSword, rootBone)
        if(det.mode === "stand") this.keepSword(rootSword, rootBone)
        if(det.dirTarg){
            body.lookAt(new Vector3(det.dirTarg.x,body.position.y,det.dirTarg.z),0,0,0)
        }
        if(det.mode === undefined) this.keepSword(rootSword, rootBone)

        // this.createMessage({name: det.name, message: "has Joined !"})
        players.push(toPush)
        
        log(`${det.name} mesh created !`)
        if(isMine){
            toPush.weaponCol = weaponCol
            toPush.camTarg = camTarg
            return toPush
        }
        this.countActivePl()
    }
    createNpc(theCharacterRoot, det, castShadow, npcCol){
        if(det.place !== this.currentPlace) return

        let intervalWalking
        // _id, name, nType, gender, toWear, displayW, x, z = det
        const body = MeshBuilder.CreateBox(`npc.${det._id}.${det.nType}`, {size: .2, height: 1.7}, scene)
        body.position = new Vector3(det.x,this.yPos,det.z);
        body.isVisible = false
        body.actionManager = new ActionManager(scene)

        if(fakeShadow) this.putFakeShadow(body)
        if(det.nType === "walker" && det._moving){
            intervalWalking = setInterval(() => {
                const meNpc = simpleNpc.find(npzz => npzz._id === det._id)
                if(!meNpc){
                    log("this npc not found")
                    return clearInterval(intervalWalking)
                }
                if(meNpc._talking) return log(`${det.name} is talking retrurn`)
                if(Math.random()*10 > det.maxDistance.chanceToStop) return
                simpleNpc.forEach(npz => {
                    if(npz._talking) return
                    if(npz._id === det._id){
                        npz._moving = !npz._moving
                        if(!npz._moving) this.stopAnim(npz.anims, "walk")
                    }
                })
            }, 2000 + Math.random()*6000)

            const bxInsStart = npcCol.clone(`destination`)
            const bxInsEnd = npcCol.clone(`destination`)
            bxInsStart.position = new Vector3(det.x,0,det.z)
            bxInsEnd.position = new Vector3(det.maxDistance.x,0,det.maxDistance.z)
            this.toRegAction(body, bxInsEnd, () => {
                const {x,z} = bxInsStart.position
                body.lookAt(new Vector3(x, body.position.y, z),0,0,0)
            })
            this.toRegAction(body, bxInsStart, () => {
                const {x,z} = bxInsEnd.position
                body.lookAt(new Vector3(x, body.position.y, z),0,0,0)
            })
        }
        let entries = theCharacterRoot.instantiateModelsToScene();
        entries.animationGroups.forEach(ani => {
            ani.name = ani.name.split(" ")[2]
            if(ani.name === "walk") return
            if(ani.name === "0Idle") return ani.play(true)
            ani.dispose()
        })
        let meshes = []
        let rHead
        entries.rootNodes[0].getChildren().forEach(mes => {
            mes.name = mes.name.split(" ")[2]
            if(mes.name !== "Armature") meshes.push(mes)
            if(mes.name === "Armature"){
                mes.getChildren().forEach(mes => {
                    if(mes.name.includes("rbone")) rHead = mes.getChildren()[0].getChildren()[0].getChildren()[0]
                })     
            }
        })
        allhelmets.forEach(helm => {
            if(det.helmet){
                if(helm.name.split(".")[1] === det.helmet.name){
                    const clonedHelmet = helm.clone(`${helm.name}`)
                    clonedHelmet.parent = rHead
                    clonedHelmet.position = new Vector3(0,0,0);
                }
            }
        })

        entries.rootNodes[0].parent = body
        entries.rootNodes[0].position.y -= this.yPos
        entries.rootNodes[0].rotationQuaternion = null
        entries.skeletons[0].dispose()

        const {hair, cloth, pants, boots, hairColor} = det.toWear
        this.suitUpdate(meshes, hair, cloth, pants, boots, hairColor, scene, light)

        const nameMesh = this.createNameDisplay(1.3, det._id, det.name, body, 60)

        let rHand
        let rootBone
        const rootSword = MeshBuilder.CreateBox(`rootsword.${det._id}`, {size: .5}, scene)
        rootSword.isVisible = false;
        
        meshes.forEach(mesh => {
            if(mesh.name.includes("body") && castShadow) shadowGen.addShadowCaster(mesh)
            if(mesh.name.includes('armor')){
                if(mesh.name.includes(det.armor.name)){
                    mesh.isVisible = true
                }else{
                    mesh.dispose()
                }
            }
            if(mesh.name.includes('gear')) mesh.dispose()
        })
        entries.rootNodes[0].getChildren()[0].getChildren().forEach(mesh => {
            if(mesh.name.includes("rbone")){
               rHand = mesh.getChildren()[0].getChildren()[0].getChildren()[2].getChildren()[0].getChildren()[0].getChildren()[0]
               rootBone = mesh.getChildren()[0]
            }
        })
        
        if(det.displayW.name !== "none"){
            allsword.forEach(sword => {
         
               if(sword.name.split(".")[1] === det.displayW.name){
                    const swordClone = sword.clone("cloneswrod")
                    swordClone.parent = rootSword
                    if(sword.name.includes("glow")){
                        log(`merong glow sa sword ni ${det.name}`)
                        const {x,y,z} = rootSword.getAbsolutePosition()
                        this.createParticle("flare", 100, {x,y,z}, .02, {min: .5, max: 1.4}, .08, .11, -.3, "sphere", true, rootSword, "red")
                    }
                }
          
            })
        }
        this.keepSword(rootSword, rootBone);

        const toPush = {
            _id: det._id,
            name: det.name,
            bx: body,
            _moving: false,
            _attacking: false,
            _minning: det._minning ? det._minning : false,
            _training: det._training ? det._training : false,
            _talking: false,
            mode: det.mode === undefined ? 'stand' : det.mode,
            status: [], // bashed(will be moved backwards)
            dirTarg: {x:det.dirTarg.x, z: det.dirTarg.z},
            anims: entries.animationGroups,
            meshes,
            rHand, rootBone, rootSword,
            nameMesh,
            intervalWalking
        }
        body.lookAt(new Vector3(det.dirTarg.x,body.position.y,det.dirTarg.z),0,0,0);
        if(det.mode === undefined) this.keepSword(rootSword, rootBone)
        simpleNpc.push(toPush);
        this.toRegAction(this.myChar.detector, body, () => {
            this.openPopUpAction("speak");
            this.targetRecource = body;
            log(det)
            if(det.condition === "none") return this.targDetail = det.speech;            
            const {theSpeech, additionalDet} = det.condition(this.det);
            switch(det.name){
                case "jericho":
                    this.targDetail = theSpeech;
                    if(additionalDet !== undefined){
                        this.craftToLearn = additionalDet
                    }else{
                        this.craftToLearn = undefined
                    }
                    
                    log("I will speak to the craftsman")
                    log(`he will teach me `, additionalDet)
                break;
                case "markus":
                    this.targDetail = theSpeech;
                    if(additionalDet !== undefined){
                        this.craftToLearn = additionalDet
                    }else{
                        this.craftToLearn = undefined
                    }
                    
                    log("I will speak to the craftsman")
                    log(`he will teach me `, additionalDet)
                break
                default:
                    
                    this.targDetail = det.condition(this.det);
                    log(this.targDetail)
                break
            }
        })
        this.toRegActionExit(this.myChar.detector, body, () => {
            this.closePopUpAction()
            // this.targetRecource = undefined
            // this.targDetail = undefined
        })
    }

    // CREATION OF SKILLS
    createCastLong(mesh, pos, dirTarg, spd, scene){
        const longRangeSkill = mesh.clone(`lr.${makeRandNum()}`)
        longRangeSkill.position = new Vector3(pos.x,1,pos.z)
        longRangeSkill.lookAt(new Vector3(dirTarg.x,longRangeSkill.position.y, dirTarg.z),0,0,0)
        longRangeSkill.actionManager = new ActionManager(scene)

        this.longRangeSkills.push({mesh: longRangeSkill, spd})
    }
    createSharpRock(pos, dirTarg, dmg, willStartDown){
        if(this.det.hp <= 0) return
        const sharpBx = MeshBuilder.CreateBox("sharpBx", {size: .1, depth: 1}, this._scene)
        sharpBx.isVisible = false
        const newSharpRock = sharpRock.clone("sharpRock");
        newSharpRock.parent = sharpBx;
        newSharpRock.addRotation(Math.PI/2,0,0)
        sharpBx.position = new Vector3(pos.x, pos.y, pos.z)
        const meshId = makeRandNum()
        // willStartDown && newSharpRock.locallyTranslate(new Vector3(-2 + Math.random()*2,0,-2 + Math.random()*2));
        sharpBx.lookAt(new Vector3(dirTarg.x,dirTarg.y,dirTarg.z),0,0,0, BABYLON.Space.WORLD)
        this.flyingWeaponz.push({meshId, mesh: sharpBx})
        this.toRegAction(this.myChar.bx, sharpBx, () => {
            if(!this.flyingWeaponz.some(flymesh => flymesh.meshId === meshId)) return
            this.stopAnim(this.myChar.anims, "running", true)
            this.stopAnim(this.myChar.anims, "hardhitpunch", true)
            this.myChar._moving = false
            this.stopPress()
            closeGameUI()
            clearTimeout(this._enableKeyPessTimeout)

            this.hitByNonMultiAI(this.myChar.bx, sharpBx, dmg, "hardhitpunch", makeRandNum(), false)
            const myFos = this.myChar.bx.position
            this.createBloodParticle("blood", 10, {x: myFos.x, y: myFos.y, z: myFos.z }, "sphere", true, 1, true, false)
            this.flyingWeaponz = this.flyingWeaponz.filter(mezz => mezz.meshId !== meshId)
            sharpBx.position.y = -.10 + Math.random()*1
            this.myChar.spearStruck.play()
            this._enableKeyPessTimeout = setTimeout(() => {
                this.allCanPress()
                this.enableAttackBtn()
                openGameUI()
            }, 500)
        })
        setTimeout(() => {
            if(this.flyingWeaponz.some(flymesh => flymesh.meshId === meshId)){
                this.flyingWeaponz = this.flyingWeaponz.filter(mezz => mezz.meshId !== meshId)
                sharpBx.dispose()
                newSharpRock.dispose()
            }
        }, 3000)
    }
    createNewCircle(kolur, rotat, pos, playerId, scalingDura, infrontP){
        let timeOutForMagicCirc
        const newCircle = magicCircle.clone(`circle.${playerId}.${makeRandNum()}`)
        newCircle.position = new Vector3(pos.x,pos.y, pos.z)
        newCircle.visibility = .15
        const glowMat = new StandardMaterial("glowCircle", scene);
        glowMat.emissiveColor = new Color3(kolur.r,kolur.g,kolur.b);
        newCircle.rotation = new Vector3(0, 0, 0)
        !infrontP && newCircle.addRotation(rotat.x, rotat.y, rotat.z)
        newCircle.isVisible = true
        newCircle.material = glowMat
        newCircle.scaling = new Vector3(0,.02,0);
        this.allScaling.push({mesh: newCircle, spd: .03})
        this.allRotating.push({mesh: newCircle, spd: .009})
        if(infrontP){
            this.playerLookAt(newCircle, infrontP)
            newCircle.addRotation(Math.PI/2,0,0)
        }
        // sounds
        const showingInS = this._allSounds.openMagicCircS.clone("magicCircS")
        showingInS.attachToMesh(newCircle)
        showingInS.play()
        timeOutForMagicCirc = setTimeout(() => {
            this.allScaling = this.allScaling.filter(circs => circs.mesh.name !== newCircle.name)
            this.allVanishing.push({mesh: newCircle, spd: .0007})
            timeOutForMagicCirc = setTimeout(() => {
                this.allVanishing = this.allVanishing.filter(circs => circs.mesh.name !== newCircle.name)
                glowMat.dispose()
                newCircle.dispose()
            }, 6000)
        }, scalingDura)
        magicCircleTimeOuts.push(timeOutForMagicCirc)

        return newCircle
    }
    createSwordSlash(scene, playerId, kolur){
        const {r,g,b} = kolur
        const slashMesh = slash.clone(`slashes.${playerId}`)
        const glowMat = new StandardMaterial("glowSlash", scene);
        glowMat.emissiveColor = new Color3(r,g,b);
        slashMesh.material = glowMat
        slashMesh.visibility = .9
        return slashMesh
    }
    createFlyingWeapon(mypos, weapDmg, myMode, weaponMesh, pos, dirTarg, weaponDetail, ownerId, isDemonThrowing){
        const weapMesh = MeshBuilder.CreateBox("sword.flying", { size: .5}, this._scene) // size : .3
        weapMesh.position = new Vector3(pos.x,this.yPos+1,pos.z)
        weapMesh.isVisible = false
     
        this.playerLookAt(weapMesh, dirTarg)
        weapMesh.locallyTranslate(new Vector3(.1,0,-.5))
        weapMesh.actionManager = new ActionManager(this._scene)
        const weapId = makeRandNum()
        const clonedWeapon = weaponMesh.clone("cloned")
        clonedWeapon.rotationQuaternion = null
        clonedWeapon.parent = weapMesh
        clonedWeapon.scaling = new Vector3(.2,.19,.2)
        clonedWeapon.isVisible = true
        log('cloned weapon here ', clonedWeapon)
        
        clonedWeapon.addRotation(Math.PI/2,0,0)
        if(!isDemonThrowing){
            Monsterz.forEach(mons => {
                if(mons.monsName.includes("ghost") || mons.monsName.includes("slime")){
                    this.toRegAction(weapMesh, mons.body, () => {
                        const monsFos = mons.body.position
                        this.createTextMesh(makeRandNum(), "miss", "white", {x: monsFos.x, y: monsFos.y, z: monsFos.z }, 70, this._scene, true, false)
                    })
                    return
                }
                if(!mons.rootMesh) return log(`rootMesh of ${mons.monsName} is not capable`)
                this.toRegAction(weapMesh, mons.rootMesh, () => {
                    const isStillFlying = this.flyingWeaponz.find(flywep =>flywep.meshId === weapId)
                    if(!isStillFlying) return log("the spear is already stabbed")
                    const theOwnerOfSpear = players.find(pl => pl._id === ownerId)
                    if(!this.socketAvailable){
                        this.monsterIsHit(mons.monsId, mypos, ownerId, weapDmg, mons.body.getAbsolutePosition(), "throw", true)
                    }else{
                        const mpos = mons.body.getAbsolutePosition()
                        // babawasan niya yung buhay ng monster
                        this.socket.emit("monsterIsHit", {monsId: mons.monsId, dmgTaken: weapDmg, 
                        _id: ownerId,
                        pos: {x: mpos.x, z: mpos.z}, mypos: {x: mypos.x, z: mypos.z}, mode: "throw", isCritical: true})
                    }              
                    
                    theOwnerOfSpear && this.chaseSomeone(theOwnerOfSpear, mons)
                    
                    this.flyingWeaponz = this.flyingWeaponz.filter(weaps => weaps.meshId !== weapId)
                    weapMesh.parent = mons.rootMesh
                    weapMesh.position = new Vector3(0,0,0)
                    
                    switch(mons.monsName){
                        case "goblin":
                            weapMesh.position = new Vector3(0,.5 + Math.random()*.3,0)
                            weapMesh.scaling = new Vector3(5,5,5)
                        break;
                        case "viper":
                            weapMesh.position.y = 1 + Math.random()*.7
                            weapMesh.scaling = new Vector3(1,1,1)
                        break
                        case "minotaur":
                            log("minotaur is hit !")
                            weapMesh.position.y = Math.random()*.7
                            weapMesh.scaling = new Vector3(1,1,1)
                        break
                        case "eater":
                            log("eater is hit !")
                            weapMesh.position.y = Math.random()*.4
                            weapMesh.scaling = new Vector3(.9,.9,.9)
                        break
                        default:
                            weapMesh.position.y = Math.random()*.4
                            weapMesh.scaling = new Vector3(.9,.9,.9)
                        break
                    }
                    weapMesh.lookAt(new Vector3(mypos.x, .5, mypos.z),0,0,0,BABYLON.Space.WORLD)
                    weapMesh.addRotation(Math.PI,0,0);
                })
            })
            demons.forEach(mons => {
                if(!mons.rootMesh) return 
                this.toRegAction(weapMesh, mons.rootMesh, () => {
                    const isStillFlying = this.flyingWeaponz.find(flywep =>flywep.meshId === weapId)
                    if(!isStillFlying) return log("the spear is already stabbed")
                    
                    this.demonIsHit(mons._id, mypos,weapDmg, mons.bx.position, "throw", true)
                    const theOwnerOfSpear = players.find(pl => pl._id === ownerId)
                    theOwnerOfSpear && this.chaseSomeone(theOwnerOfSpear, mons)
                    
                    this.flyingWeaponz = this.flyingWeaponz.filter(weaps => weaps.meshId !== weapId)
      
                    weapMesh.parent = mons.rootMesh
                    weapMesh.position = new Vector3(0,Math.random()*2,0)
                    
                    weapMesh.scaling = new Vector3(5,5,5)
                    weapMesh.lookAt(new Vector3(mypos.x, .5, mypos.z),0,0,0,BABYLON.Space.WORLD)
                    weapMesh.addRotation(Math.PI,0,0);
                    weapMesh.locallyTranslate(new Vector3(0,0,-5-Math.random()*3))
                    log(this.flyingWeaponz.length)
                })
            })
        }

        let woodImpS
        weapMesh.addRotation(.05,0,0)
        if(weaponDetail){
            this.toRegAction(weapMesh, this.myChar.bx, () => {
                this.targDetail = weaponDetail
                this.targetRecource = weapMesh
                this.openPopUpAction("pickup")
            })
            this.toRegActionExit(weapMesh, this.myChar.bx, () => {
                this.targDetail = undefined
                this.targetRecource = undefined
                this.closePopUpAction()
            })

               // WHEN HIT GROUND;
            const theGround = this._scene.getMeshByName("ground")
            if(theGround){
                this.toRegAction(weapMesh, theGround, () => {
                    log("is hit the ground")
                    this.flyingWeaponz = this.flyingWeaponz.filter(weaps => weaps.meshId !== weapId)
                    weapMesh.locallyTranslate(new Vector3(0,0,-.3))
                    weapMesh.addRotation(Math.random()*.5,0,0)
                })
            }
            this._scene.meshes.forEach(mesh => {
                if(mesh.name.includes("wood")){
                    this.toRegAction(weapMesh, mesh, () => {
                        woodImpS = this._allSounds.woodCuttingS.clone()
                        woodImpS.attachToMesh(weapMesh)
                        log("is hit the tree")
                        const isStillFlying = this.flyingWeaponz.find(flywep =>flywep.meshId === weapId)
                        if(!isStillFlying) return log("the spear is already stabbed")

                        woodImpS.play()
                        this.flyingWeaponz = this.flyingWeaponz.filter(weaps => weaps.meshId !== weapId)
                        weapMesh.locallyTranslate(new Vector3(0,0,-.3))
                        
                    })
                }
                if(mesh.name.includes("block")) {
                    this.toRegAction(weapMesh, mesh, () => {
                        log("is hit the cliff")
                        this.flyingWeaponz = this.flyingWeaponz.filter(weaps => weaps.meshId !== weapId)
                        weapMesh.locallyTranslate(new Vector3(0,0,-.3))
                    })
                }
                if(mesh.name.includes("hitbox")) {
                    this.toRegAction(weapMesh, mesh, () => {
                        log("is hit the box")
                        this.flyingWeaponz = this.flyingWeaponz.filter(weaps => weaps.meshId !== weapId)
                        weapMesh.position.y = 1
                        weapMesh.addRotation(Math.random()*.5,0,0)
                    })
                }
            })
            
            this.lootz.push(weaponDetail)
        }  
        this.flyingWeaponz.push({mesh: weapMesh, meshId: weapId})
        setTimeout(() => {
            if(woodImpS) woodImpS.dispose()
        }, 2500)  
        return {weapMesh, weapId, clonedWeapon}
    }
    prepateToAttack(monsId, attackLimit, dmg){
        let willProceed = true
        const ourDet = Monsterz.find(mons => mons.monsId === monsId)
        if(!ourDet) {
            log("Our detail is not found")
            return willProceed = false
        }
        
        let theAttacks = attackLimit
        if(ourDet.monsName === "viper") theAttacks = 2.7
        let randNum = Math.floor(Math.random() * theAttacks);
        if(ourDet.monsName.includes("slime")) randNum=''
        const theMonzFos = ourDet.body.position
        return { willProceed, randNum, theMonzFos }
    }
    letsAttack(theIdOfPlayer, ourDet, monsId, dmg){

        const { willProceed, randNum, theMonzFos } = this.prepateToAttack(monsId, 1.5, dmg)
        if(!willProceed) return log("cannot attack anymore")
        if(this.socketAvailable){
            log("monster will attack online")
            if(!theMonzFos) return log("undefined theMonsFos")
            this.socket.emit("monsWillAttack", {
                monsId: monsId, 
                targHero: theIdOfPlayer, 
                pos: {x: theMonzFos._x, y: theMonzFos._y, z: theMonzFos._z},
                animaName: `attack${randNum}`
            })
        }else{
            this.monsterAttack(monsId, ourDet.monsName, theMonzFos, theIdOfPlayer, `attack${randNum}`)
        }
    }
    // CREATION OF MONSTERS
    createMonster(monsRoot, shadowGen, castShadow, monsId, monsName, armorName, pos, spd, hp, maxHp, monsLvl, atkInterval, dmg, scene, targHero, expGain, monsBreed, effects){
        if(!monsRoot) return log("monsroot is not defined")

        let attackingInterval
        let isLookingInterval
        let intervalWillAttack
        let onCollideTimeOut

        let intervalLR

        const scaleR = .3 * Math.random()
        const randomSec = 3000 + (5000 * Math.random())
        
        const body = MeshBuilder.CreateBox(`goblin.${monsId}`, {size: monsName === "minotaur" ? 1 : .4, height: 2}, this.scene)
        body.position = new Vector3(pos.x,1,pos.z);
        body.isVisible = true;
        body.rotation.y = Math.random() * 4
        body.visibility = .9

        let weapCSize = { width: .5, height: .6, depth: 1}
        let weapZ = .5
        let punchedS
        let effectS
        let farSound
        let chasingS
        let monsSoundDied = undefined
        let monsSoundHit = undefined
        switch(monsName){
            case "golem":
                punchedS = this._allSounds.rockSmashS.clone()
            break;
            case "viper":
                punchedS = this._allSounds.snakeBitS.clone()
                effectS = this._allSounds.poisonS.clone()
                farSound = this._allSounds.snakeSound.clone()
                log("Viper connected sounds")
            break;
            case "monoloth":
                farSound = this._allSounds.beeS.clone();
                punchedS = this._allSounds.punched.clone()
            break
            case "hellhound":
                chasingS = this._allSounds.houndChaseS.clone();
                punchedS = this._allSounds.houndBite.clone()
                weapCSize = { width: .5, height: 1, depth:2}
                weapZ = 1.5
            break;
            case "minotaur":
                weapZ = 1.1
                punchedS = this._allSounds.punched.clone()
                monsSoundDied = this._allSounds.minoDeathS.clone(`hitSound.${monsName}`)
                monsSoundDied.attachToMesh(body)
                monsSoundHit = this._allSounds.minotaurS.clone(`hitSound.${monsName}`)
                monsSoundDied.setPlaybackRate(1.1+Math.random()*.3)
            break;
            case "goblin":
                monsSoundDied = this._allSounds.goblinDeathS.clone(`hitSound.${monsName}`)
                monsSoundDied.attachToMesh(body)
                monsSoundHit = this._allSounds.goblinHitS.clone(`hitSound.${monsName}`)
                punchedS = this._allSounds.punched.clone()
                monsSoundDied.setPlaybackRate(1.2+Math.random()*.5)
            break;
            default:
                punchedS = this._allSounds.punched.clone()
            break
        } 
        const sliceHitS = this._allSounds.sliceHit.clone();
        const spearStruck = this._allSounds.spearStruckS.clone();

        punchedS.attachToMesh(body)
        sliceHitS.attachToMesh(body)
        spearStruck.attachToMesh(body)
        if(effectS !== undefined) effectS.attachToMesh(body)
        if(farSound !== undefined) farSound.attachToMesh(body)

        let bloodSplat = this.createBloodParticle("blood",300, { x: 0, y: 0, z: 0}, "sphere", false, 1, false, body)

        const enemyDetection = MeshBuilder.CreateBox(`enemyDetection.${monsId}`, {size: 6, height: .6}, scene)
        enemyDetection.parent = body
        enemyDetection.isVisible = false

        let atkDetDepth = monsName === "minotaur" ? 1.9 : .8
        const atkDetection = MeshBuilder.CreateBox(`atkDetection.${monsId}`, {depth: atkDetDepth , height: .6, width: .5}, scene)
        atkDetection.parent = body
        atkDetection.position.z += .4
        atkDetection.isVisible = false

        const weapon = MeshBuilder.CreateBox(`weapon.${monsId}`, {depth: weapCSize.depth, height: weapCSize.height, width: weapCSize.width}, scene)
        weapon.parent = body
        weapon.position.z += weapZ

        let entries = monsRoot.instantiateModelsToScene();
        entries.animationGroups.forEach(ani => ani.name = ani.name.split(" ")[2])
        
        let rBone = undefined
        let rMeshSize = {size: 2, height: 8}
        let shadowSize = 2
        switch(monsName){
            case "viper":
                rMeshSize = {size: .5, height: 3}
            break
            case "minotaur":
                rMeshSize = {size: .6, height: 2}
                shadowSize = 4
            break
            case "eater":
                rMeshSize = {size: 1, height: 1}
                shadowSize = 4
            break
            case "golem":
                rMeshSize = {size: 1, height: 1.5}
                shadowSize = 6.5
            break
            case "hellhound":
                shadowSize = 5
            break;
        }
        this.putFakeShadow(body, shadowSize)

        const meshes = entries.rootNodes
        if(!entries.rootNodes[0].getChildren()) return log(`error making ${monsName} `)
        entries.rootNodes[0].getChildren().forEach(mes => {
            mes.name = mes.name.split(" ")[2]
            // if(mes.name.includes("body") && castShadow) shadowGen.getShadowMap().renderList.push(mes)
            if(monsName === "slime"){
                log("yes a slime")
                if(mes.name.includes("slime")){
                    log("body name is slime")
                    const slimeMat = new StandardMaterial("monsMat")
                    slimeMat.diffuseColor = new Color3(0, 0.69, 0.81)
                    mes.material = slimeMat
                }
            }
            if(mes.name.includes("armor")){
                if(mes.name.includes(armorName)){
                    mes.isVisible = true
                }else mes.dispose()
            }
            if(mes.name === "Armature"){
                mes.getChildren().forEach(arm => {
                    
                    if(arm.name.includes("root")) {
                        rBone = arm
                        if(monsName.includes("minotaur")){
                            arm.getChildren().forEach(bns => {
                                if(bns.name.split(" ")[2] === "Spine"){
                                    log("minotaur spine is assigned")
                                    rBone = bns.getChildren()[0]
                                }
                            })
                        }
                        if(monsName.includes("golem")){
                            arm.getChildren().forEach(bns => {
                                if(bns.name.includes("lowerSpine")) rBone = bns
                            })
                        }
                    }
                })
            }
        })
        let rootMesh = undefined
        if(rBone !== undefined){
            rootMesh = MeshBuilder.CreateBox(`rootMesh.${monsId}`, {size: rMeshSize.size, height: rMeshSize.height}, scene)
            rootMesh.parent = rBone
            rootMesh.isVisible = false
        }    
        // log(`checking monster rootBone ${monsName} ${rBone !== undefined && rBone.name}`)
        entries.skeletons[0].dispose()
        
        meshes[0].scaling = new Vector3(1 + scaleR,1 + scaleR,1 + scaleR)
        meshes[0].parent = body
        meshes[0].position = new Vector3(0,-1,0)
        if(monsName === "golem") meshes[0].rotationQuaternion = null
        // ACTION MANAGERS
        body.actionManager = new ActionManager(scene)
        enemyDetection.actionManager = new ActionManager(scene)
        atkDetection.actionManager = new ActionManager(scene)
        weapon.actionManager = new ActionManager(scene)
        
        let namePosY = 1.3
        let healthPosY = 1
        switch(monsName){
            case "minotaur":
                namePosY = 1.8
                healthPosY = 1.5
                
            break;
            case "viper":
                namePosY = 2
                healthPosY = 1.9
            break;
            case "goblin":
                
            break
            case "golem":
                namePosY = 3.1
                healthPosY = 3
                bloodSplat = undefined
            break;
        }

        const nameMesh = this.createMonsName(namePosY, monsId, monsName,body)
        const {robHealthGui, monsHealthPlane} = this.createMonsHealthBar(healthPosY, monsId, body, hp, maxHp)
        // const boneCore = meshes[0].getChildren()[0].getChildren()[1].getChildren()[0]
        // weapon.parent = boneCore

        enemyDetection.isVisible = false
        atkDetection.isVisible = false
        body.isVisible = false
        weapon.isVisible = false
        monsHealthPlane.isVisible = false
        if(targHero !== undefined){
            const theHero = this._scene.getMeshByName(`box.${targHero}`)
            if(!theHero){
                log('hero not found')
            }else{
                const heroPs = theHero.position
                body.lookAt(new Vector3(heroPs.x,body.position.y,heroPs.z),0,0,0)
            }
        }
        if(Monsterz.length){
            Monsterz.forEach(mon => {
                mon.body.actionManager.registerAction(new ExecuteCodeAction(
                    {
                        trigger: ActionManager.OnIntersectionEnterTrigger,
                        parameter: body
                    }, e => {                        
                        const myfos = this.myChar.bx.position
                        const bodyfos = body.position
                        mon.body.lookAt(new Vector3(bodyfos.x,mon.body.position.y,bodyfos.z),0,0,0)
                        mon.body.locallyTranslate(new Vector3(Math.random()*.3,0,-Math.random()*.6))
                        mon.body.lookAt(new Vector3(myfos.x,mon.body.position.y,myfos.z),0,0,0)
                    }
                ))
            })
        }
        if(monsSoundHit !== undefined) monsSoundHit.attachToMesh(body)
        
        const animationGroups = entries.animationGroups
        // ACTION MANAGERS
        enemyDetection.actionManager.registerAction(new ExecuteCodeAction(
            {
                trigger: ActionManager.OnIntersectionEnterTrigger,
                parameter: this.myChar.bx
            }, e => {
                monsHealthPlane.isVisible = true
                const theMons = Monsterz.find(mons => mons.monsId === monsId)
                if(!theMons) return log("cannot find the monster")
                if(chasingS) {
                    if(!chasingS.isPlaying) chasingS.play()
                }
                const isMyTargetHere = this._scene.getMeshByName(`box.${theMons.targHero}`)
                if(!isMyTargetHere){

                    log("target is no longer here time to attack other")
                    Monsterz = Monsterz.map(monsx => monsx.monsId === monsId ? {...monsx, targHero: this.det._id, isChasing: true, isAttacking: false} : monsx)
 
                    if(this.socketAvailable){
                        log("is online will chase")
                        clearTimeout(onCollideTimeOut)
                        this.socket.emit("monsWillChase", {monsId, targHero: this.det._id})
                    }else{
                        theMons.isAttacking = false
                        theMons.targHero = this.det._id
                        theMons.isChasing = true
                    }
                    let willAtackLR = false

                    return
                }
                if(isMyTargetHere) return log("the target is here return")
                if(this.det.hp <= 0) return log("this player is dead")                
            }
        ))
        enemyDetection.actionManager.registerAction(new ExecuteCodeAction(
            {
                trigger: ActionManager.OnIntersectionExitTrigger,
                parameter: this.myChar.bx
            }, e => {
 
            const theMonster = Monsterz.find(mn => mn.monsId === monsId)
            let toThrow = false
            if(theMonster){
                log("yeah found the monster")
                switch (theMonster.monsName) {
                    case "golem":
                        toThrow = true
                        this.playAnim(animationGroups, "throw")
                    break;
                    case "monoloth":
                        toThrow = true
                        this.playAnim(animationGroups, "attack1")
                    break;
                }
                if(toThrow){
                    if(this.socketAvailable){
                        this.socket.emit("monster-willthrow", {
                            monsId,
                            playerId: this.myChar._id,
                            dmg: 10,
                            place: this.currentPlace
                        })
                      
                    }else{
                        this.initMonsterThrow(monsId, this.myChar, 10)
                    }
                }
            }else{
                log("not found")
            }
                // const bdypos = body.position
                // monsHealthPlane.isVisible = false;
                // if(this.socketAvailable){
                //     const theMons = Monsterz.find(mons => mons.monsId === monsId)
                //     if(!theMons) return log("exiting this monster is not found")
                //     clearTimeout(onCollideTimeOut)
                //     onCollideTimeOut = setTimeout(() => {
                //         if(theMons.targHero === this.det._id) this.socket.emit("monsWillStop", {monsId, targHero: this.det._id, pos: {x: bdypos.x, z: bdypos.z}})
                //     }, 500)
                    
                // }else{
                //     const theMons = Monsterz.find(mons => mons.monsId === monsId)
                //     if(!theMons) return log("cannot leave undefined monster")
                //     if(theMons.targHero === this.det._id){
                //         Monsterz = Monsterz.map(mon => mon.monsId === theMons.monsId ? {...mon, isChasing: false, isAttacking: false, targHero: undefined} : mon)
                //     }
                // }
            }
        ))
        atkDetection.actionManager.registerAction(new ExecuteCodeAction(
            {
                trigger: ActionManager.OnIntersectionEnterTrigger,
                parameter: this.myChar.bx
            }, e => {
                const theMons = Monsterz.find(mons => mons.monsId === monsId)
                if(!theMons) return log("cannot find the monster")
                if(this.det.hp <= 0) return log("this player is dead")
                const theIdOfPlayer = this.myChar.bx.name.split(".")[1]
   
                this.stopAnim(theMons.anims, "running", true)

                if(theMons.targHero === theIdOfPlayer){
                    log("match the id of target is me")
                    theMons.isChasing = false
                    theMons.isAttacking = true
                    this.letsAttack(theIdOfPlayer, theMons, monsId, dmg)
                    clearInterval(intervalWillAttack)
                    intervalWillAttack = setInterval( () => {
                        const ourDet = Monsterz.find(mondz => mondz.monsId === monsId)
                        if(!ourDet){
                            log(`${monsName} must be dead`)
                            clearInterval(intervalWillAttack)
                        }
                        this.letsAttack(theIdOfPlayer, ourDet, monsId, dmg)
                    }, atkInterval)
                }else{
                    log("Mons targHero " + theMons.targHero)
                    log("not my target")
                    if(theMons.targHero === undefined){
                        log(" but my targ is undefined then I will attack");
                        theMons.isChasing = false
                        theMons.isAttacking = true
                        this.letsAttack(theIdOfPlayer, theMons, monsId, dmg)
                        clearInterval(intervalWillAttack)
                        intervalWillAttack = setInterval( () => {
                            const ourDet = Monsterz.find(mondz => mondz.monsId === monsId)
                            if(!ourDet){
                                log(`${monsName} must be dead`)
                                clearInterval(intervalWillAttack)
                            }
                            this.letsAttack(theIdOfPlayer, ourDet, monsId, dmg)
                        }, atkInterval)
                    }

                }
            }
        ))
        atkDetection.actionManager.registerAction(new ExecuteCodeAction(
            {
                
                trigger: ActionManager.OnIntersectionExitTrigger,
                parameter: this.myChar.bx
            }, e => {
                const theMons = Monsterz.find(mons => mons.monsId === monsId)
                if(!theMons) return log("cannot find the monster")
                if(this.det.hp <= 0) return log("this player is dead")
                const theIdOfPlayer = this.myChar.bx.name.split(".")[1]
                if(theMons.targHero === theIdOfPlayer){
                    clearInterval(intervalWillAttack)
                    setTimeout(() => {
                        if(this.det.hp <= 0) return log("this player is dead")
                        if(this.socketAvailable){
                            this.socket.emit("monsWillChase", {monsId, targHero: this.det._id})
                        }else{
                            theMons.isAttacking = false
                            theMons.targHero = this.det._id
                            theMons.isChasing = true
                        }
                    }, 300)
                }else{
                    log("not my target")
                }
            }
        ))
        weapon.actionManager.registerAction(new ExecuteCodeAction(
            {
                trigger: ActionManager.OnIntersectionEnterTrigger,
                parameter: this.myChar.bx
            }, e => {
                const theMons = Monsterz.find(mons => mons.monsId === monsId)
                if(!theMons) return log("cannot find the monster")
                if(this.det.hp <= 0) return log("this player is dead")
                if(this.myChar.inVulnerable) return log("player Invulnerable")
                const theIdOfPlayer = this.myChar.bx.name.split(".")[1]
                punchedS.setPlaybackRate(1+Math.random()*.2)
                punchedS.play()
                this.stopMoving()
                // the socket is only for animating your character from other pc and it will return so you wont get affected
                this.socketAvailable && this.socket.emit("playerIsHit", {_id: theIdOfPlayer, monsId, animName: 'hitcenter',dmg})
                log(`I am hit by ${monsName}`)
                this.hitByNonMultiAI(this.myChar.bx, body, dmg, 'hitcenter', monsId, effects ? effects : false)
                switch (monsName) {
                    case "hellhound":
                        this.myChar.bloodSplat.start()
                    break;
                }
            }
        ))
        // for sounds
        if(farSound !== undefined){
            log(`${monsName} have a far sound`)
            body.actionManager.registerAction(new ExecuteCodeAction(
                {
                    trigger: ActionManager.OnIntersectionEnterTrigger,
                    parameter: this.myChar.farDetector
                }, e => {
                    log(`colliding with ${monsName}`)
                    farSound.play()
                }
            ))
        }
        if(monsName.includes("slime")){
            const myrootbone = entries.rootNodes[0].getChildren()[0].getChildren()[1]
            weapon.parent = myrootbone
            weapon.position.y = 3.6
            weapon.position.z = -1
            monsSoundDied = this._allSounds.slimeDeathS.clone(`hitSound.${monsName}`)
            monsSoundDied.attachToMesh(body)
        }
        const standBy = () => {
            clearInterval(attackingInterval)
            enemyDetection.dispose()
            atkDetection.dispose()
            weapon.dispose()
        }
        const enemy = {
            bloodSplat,
            nameMesh,
            rootMesh,
            monsSoundHit,
            spearStruck,
            monsId, 
            monsLvl,
            body, monsName,
            enemyDetection,
            atkDetection,
            weapon,
            monsHealthPlane,
            robHealthGui,
            anims: animationGroups,
            hp, maxHp, spd,
            isChasing: false,
            isAttacking: false,
            isHit: false,
            targHero,
            intervalWillAttack,
            standBy,
            expGain,
            punchedS,
            sliceHitS,
            monsSoundDied,
            monsBreed,
            effectS,
            farSound,
            chasingS
        }
        let intervalLookAround
        intervalLookAround = setInterval(() => {
            const theMons = Monsterz.find(mons => mons.monsId === monsId)
            if(!theMons) return clearInterval(intervalLookAround)
            if(theMons.targHero !== undefined) return
            if(Math.random() > .5) return 
            this.playAnim(theMons.anims, "lookaround")
        }, 5000)
        enemy.anims.forEach(anim => anim.name === '0Idle' && anim.play(true))
        Monsterz.push(enemy);
        // log("created " + monsName)
    }
    createDemon(theCharacterRoot, det, npcCol, scene){
        // if(det.place !== this.currentPlace) return log(`npc ${det.name} not from here`)

        let intervalWalking
        let intervalStriking
        let chaseTimeOut
        let attackTimeOut
        // _id, name, nType, gender, toWear, displayW, x, z = det
        const body = MeshBuilder.CreateBox(`demon.${det._id}.${det.nType}`, {size: .2, height: 1.7}, scene)
        body.position = new Vector3(det.x,this.yPos,det.z);
        body.isVisible = false
        body.actionManager = new ActionManager(scene)

        const kolur = det.demonColor
        const {r,g,b} = kolur
        const slashMesh = slash.clone(`demonSlash.${det._id}`)
        const glowMat = new StandardMaterial("demonGlowSlash", scene);
        glowMat.emissiveColor = new Color3(r,g,b);
        slashMesh.material = glowMat
        slashMesh.visibility = .9
        
        const {lifeGui, playerHealthMesh} = this.createPlayerHealthBar(1.1, det._id,body, det.hp,det.maxHp, scene)

        const humanDetector = MeshBuilder.CreateGround("humanDetector", {width: 30, height: 30}, scene)
        humanDetector.parent = body
        humanDetector.position = new Vector3(0,0,0);
        humanDetector.actionManager = new ActionManager(scene)
        
        const atkColl = MeshBuilder.CreateGround("atkColl", {width: 1.5, height: 1.5}, scene)
        atkColl.parent = body
        atkColl.position = new Vector3(0,0,0);
        atkColl.actionManager = new ActionManager(scene)

        const longRangeCol = MeshBuilder.CreateGround("longRangeCol", {width: 7.8, height: 7.8}, scene)
        longRangeCol.parent = body
        longRangeCol.position = new Vector3(0,0,0);
        longRangeCol.actionManager = new ActionManager(scene)

        const weaponCol = MeshBuilder.CreateBox("demonWeaponCol", {size: .5, height: 5}, scene)
        weaponCol.actionManager = new ActionManager(scene)

        const rootMesh = MeshBuilder.CreateBox("demonRoot", {size: 2.5, height: 6.5}, scene)

        humanDetector.isVisible = false
        atkColl.isVisible = false
        longRangeCol.isVisible = false
        weaponCol.isVisible = false
        rootMesh.isVisible = false

        if(fakeShadow) this.putFakeShadow(body)

        let entries = theCharacterRoot.instantiateModelsToScene();
        entries.animationGroups.forEach(ani => {
            ani.name = ani.name.split(" ")[2]
            if(ani.name === "0Idle") ani.play(true)
        })
        let meshes = []
        let rHead
        entries.rootNodes[0].getChildren().forEach(mes => {
            mes.name = mes.name.split(" ")[2]
            if(mes.name !== "Armature") meshes.push(mes)
            if(mes.name === "Armature"){
                mes.getChildren().forEach(mes => {
                    if(mes.name.includes("rbone")) rHead = mes.getChildren()[0].getChildren()[0].getChildren()[0]
                })     
            }
        })
        allhelmets.forEach(helm => {
            if(det.helmet){
                if(helm.name.split(".")[1] === det.helmet.name){
                    const clonedHelmet = helm.clone(`${helm.name}`)
                    clonedHelmet.parent = rHead
                    clonedHelmet.position = new Vector3(0,0,0);
                }
            }
        })

        entries.rootNodes[0].parent = body
        entries.rootNodes[0].position.y -= this.yPos
        entries.rootNodes[0].rotationQuaternion = null
        entries.skeletons[0].dispose()

        const {hair, cloth, pants, boots, hairColor} = det.toWear
        this.suitUpdate(meshes, hair, cloth, pants, boots, hairColor, scene, light)

        const nameMesh = this.createNameDisplay(1.3, det._id, det.name, body, 60)

        let rHand
        let rootBone
        const rootSword = MeshBuilder.CreateBox(`rootsword.${det._id}`, {size: .5}, scene)
        rootSword.isVisible = false;
        weaponCol.parent = rootSword;
        weaponCol.position.y += 2

        meshes.forEach(mesh => {
            if(mesh.name.includes("body")) {
                const demonMat = new StandardMaterial("demonMat", scene)
 
                switch(det.demonType){
                    case "bluedemon":
                        demonMat.diffuseColor = new Color3(r,g,b)                            
                    break;
                    case "reddemon":                        
                        demonMat.diffuseColor = new Color3(r,g,b)
                    break
                }
                demonMat.specularColor = new Color3(0,0,0)    
                mesh.material = demonMat
            } // the body mesh make it red
            if(mesh.name.includes('armor')){
                if(mesh.name.includes(det.armor.name)){
                    mesh.isVisible = true
                }else{
                    mesh.dispose()
                }
            }
            if(mesh.name.includes('gear')) mesh.dispose()
        })
        entries.rootNodes[0].getChildren()[0].getChildren().forEach(mesh => {
            if(mesh.name.includes("rbone")){
               rHand = mesh.getChildren()[0].getChildren()[0].getChildren()[2].getChildren()[0].getChildren()[0].getChildren()[0]
               rootBone = mesh.getChildren()[0]
            }
        })
        rootMesh.parent = rootBone
        rootMesh.position = new Vector3(0,0,0)

        if(det.displayW.name !== "none"){
            allsword.forEach(sword => {         
               if(sword.name.split(".")[1] === det.displayW.name){
                    const swordClone = sword.clone("cloneswrod")
                    swordClone.parent = rootSword
                    
                    if(sword.name.includes("glow")){
                        log(`merong glow sa sword ni ${det.name}`)
                        const {x,y,z} = rootSword.getAbsolutePosition()
                        this.createParticle("flare", 100, {x,y,z}, .02, {min: .5, max: 1.4}, .08, .11, -.3, "sphere", true, rootSword, "red")
                    }
                    swordClone.isVisible = true
                    swordClone.rotationQuaternion = null
                    swordClone.position = new Vector3(0,0,0)
                }          
            })
        }
        //horns
        allhelmets.forEach(helm => {
            if(helm.name.includes("helmet")) return 
            if(helm.name.split(".")[1] === det.demonType){
                const clonedHelmet = helm.clone(`${helm.name}`)
                clonedHelmet.parent = rHead
                clonedHelmet.position = new Vector3(0,0,0);
            }            
        })

        this.keepSword(rootSword, rootBone);
        const demonAnims = entries.animationGroups

        let effectS
        const sliceHitS = this._allSounds.sliceHit.clone();
        const slashS = this._allSounds.sliceFlesh.clone()
        const spearStruck = this._allSounds.spearStruckS.clone();
        const whoopS = this._allSounds.whoop.clone();
        const dieSound = this._allSounds.dyingDemonS.clone("demonDyingSound")
        
        switch(det.demonType){
            case "bluedemon":
                effectS = this._allSounds.manaAbsorbS.clone()
            break;
            default:
                effectS = this._allSounds.manaAbsorbS.clone()
            break;
        }
        
        let bloodSplat = this.createBloodParticle("blood",300, { x: 0, y: 0, z: 0}, "sphere", false, 1, false, body)

        sliceHitS.attachToMesh(body)
        slashS.attachToMesh(body)
        spearStruck.attachToMesh(body)
        whoopS.attachToMesh(body)
        dieSound.attachToMesh(body);
        effectS.attachToMesh(body);
        
        this.toRegAction(humanDetector, this.myChar.bx, () => {
            const theDemon = demons.find(dm => dm._id === det._id)
            this.playerLookAt(theDemon.bx, this.myChar.bx.position)
            theDemon.mode = "weapon"
            this.getSword(rootSword, rHand)
            theDemon._moving = true
            theDemon.targHero = this.det._id
            if(!theDemon.doneSpeaking){
                this._allSounds.enemyEncounter.play()
                this._allSounds.demonSpeech?.attachToMesh(theDemon.bx)
                this._allSounds.demonSpeech?.setPlaybackRate(1.1)
                this._allSounds.demonSpeech?.play()
                const enemSpeechCont = document.querySelector(".enemy-speech-cont")
                enemSpeechCont.innerHTML = ''
                enemSpeechCont.style.display = "flex"
                const elemP = createElement("p", "enem-speech", `"${det.speech}"`)
                enemSpeechCont.append(elemP)
                
                setTimeout(() => {
                    enemSpeechCont.style.display = "none"
                }, 2000)
            }
            theDemon.doneSpeaking = true
        })
        this.toRegAction(longRangeCol, this.myChar.bx, () => {
            const theDemon = demons.find(dm => dm._id === det._id)
            theDemon.mode = "none"
            this.initiateSkill("leap", theDemon, 0,0, false, this.myChar.bx.position, 0, "any")
            theDemon._moving = true
        })

        if(det.demonType === "reddemon"){
            this.toRegActionExit(longRangeCol, this.myChar.bx, () => {
                const theDemon = demons.find(dm => dm._id === det._id)
                if(!theDemon) return log("no demon found")
                if(Math.random() > .5) this.initiateSkill("rephantasm", theDemon, 0,0, false, this.myChar.bx.position, det.skillDmg, "any", { dmg:det.displayW.dmg,  _id: det._id})
                theDemon._moving = true
            })
        }
        this.toRegActionExit(body, this.myChar.detector, () => {
            const theDemon = demons.find(dm => dm._id === det._id)
            if(!theDemon) return log("demon not found")
            if(Math.random()>.3) return 
            this.initiateSkill("spinningStar", theDemon, 0, 0,false, this.myChar.bx.position, det.skillDmg, "any", { dmg:det.displayW.dmg,  _id: det._id})
        })
        this.toRegAction(atkColl, this.myChar.bx, () => {
            const theDemon = demons.find(dm => dm._id === det._id)
            
            theDemon.mode = "weapon"
            this.flyingWeaponz = this.flyingWeaponz.filter(wpzz => wpzz.meshId !== theDemon._id)
            theDemon._attacking = true
            theDemon._moving = false
            this.getSword(rootSword, rHand)
            this.playAnim(demonAnims, `slash.2`, false)
            clearTimeout(chaseTimeOut)
            clearInterval(intervalStriking)
            intervalStriking = setInterval(() => {
                if(this.det.hp <= 0) return clearInterval(intervalStriking)
                if(theDemon.hp <= 0) return clearInterval(intervalStriking)
                theDemon._attacking = true
                whoopS.setPlaybackRate(.9+Math.random()*.3)
                whoopS.play()
                this.playAnim(demonAnims, `slash.${Math.floor(Math.random()*2)}`, false)
            }, 2000)
        })
        this.toRegActionExit(atkColl, this.myChar.bx, () => {
            const theDemon = demons.find(dm => dm._id === det._id)
            clearTimeout(chaseTimeOut)
            chaseTimeOut = setTimeout(() => {
                
                clearInterval(intervalStriking)
                this.playerLookAt(theDemon.bx, this.myChar.bx.position)
                theDemon.mode = "weapon"
                this.getSword(rootSword, rHand)
                theDemon._moving = true
                theDemon.targHero = this.det._id
            }, 1000)
        })
        this.toRegAction(weaponCol, this.myChar.bx, () => {
            const theDemon = demons.find(dm => dm._id === det._id)
            if(!theDemon._attacking) return
            if(this.det.hp <= 0){
                clearTimeout(chaseTimeOut)
                clearInterval(intervalStriking)

                this._allSounds.demonMockS?.attachToMesh(theDemon.bx)
                this._allSounds.demonMockS?.play()
                return theDemon._moving = false
            }
            
            const demPos = theDemon.bx.getAbsolutePosition()            
            this.initSlashEffect(slashMesh, demPos, this.myChar.bx.getAbsolutePosition(), det._id, 6, .5 + Math.random()*.7, 300);
            
            this.myChar.bloodSplat.start()
            
            sliceHitS.setPlaybackRate(1.2 + Math.random()*.4)
            slashS.setPlaybackRate(.9+Math.random()*.3)
            sliceHitS.play()
            slashS.play()
            this.hitByNonMultiAI(this.myChar.bx, theDemon.bx, det.displayW.dmg, "hit", det._id, det.effects, true)
            theDemon._attacking = false
            theDemon.mode = "weapon"
        })
        const toPush = {
            _id: det._id,
            name: det.name,
            demonType: det.demonType,
            hp: det.hp,
            maxHp: det.maxHp,
            expGain: det.expGain,
            bx: body,
            _moving: false,
            _attacking: false,
            _talking: false,
            mode: det.mode === undefined ? 'stand' : det.mode,
            status: [], // bashed(will be moved backwards)
            dirTarg: {x:det.dirTarg.x, z: det.dirTarg.z},
            targHero: undefined,
            anims: entries.animationGroups,
            meshes,
            rHand, rootBone, rootSword,
            nameMesh,
            intervalWalking,
            spd: det.spd,
            lifeGui,
            playerHealthMesh,
            bloodSplat,
            sliceHitS,
            spearStruck,
            whoopS,
            humanDetector,
            longRangeCol,
            atkColl,
            weaponCol,
            rootMesh,
            dieSound,
            effectS
        }
        body.lookAt(new Vector3(det.dirTarg.x,body.position.y,det.dirTarg.z),0,0,0);
        if(det.mode === undefined) this.keepSword(rootSword, rootBone)

        demons.push(toPush);
    }
    renderMonsActions(me, monsId, robHealthGui,body, hp){
        if(me.hp <= 0){
            robHealthGui.width = `0px`;
            Monsterz = Monsterz.filter(mons => mons.monsId !== monsId)
            log("monster died")
            return
        }
        const {x,z} = this.myChar.bx.position
        if(me.isChasing && !me.isHit){
            body.lookAt(new Vector3(x, body.position.y, z),0,0,0)
            this.playAnim(me.anims, "running")
            body.locallyTranslate(new Vector3(0,0,me.spd))
        }
        robHealthGui.width = `${(me.hp/hp * 100) * 4}px`;
    }
    toDispose(meshes){
        meshes.forEach(mesh => mesh.dispose())
    }
    removeAChar(details){
        if(details._id === this.det._id) return log("return this is my ID")
        if(details.place !== this.currentPlace) return log("not same place")
        players = players.filter(playr => playr._id !== details._id)
        this.enemyRegistered = this.enemyRegistered.filter(enemId => enemId !== details._id)
        Monsterz.forEach(mons => {
            if(mons.targHero === details._id){
                mons.isChasing = false
                mons.isAttacking = false
                mons.targHero = undefined
            }
        })
        log(`remaining players including me ${players.length}` )
        const bodyOfPlayer = this._scene.getMeshByName(`box.${details._id}`)
        if(bodyOfPlayer) bodyOfPlayer.dispose()
    }
}
let toTimeOutPopUp
const openPopUp = (mesg, dura) => {
    clearTimeout(toTimeOutPopUp)
    popUp.classList.remove("transClosePopUp")
    popUp.children[0].innerHTML = mesg

    toTimeOutPopUp = setTimeout( () => {
        popUp.classList.add("transClosePopUp")
    }, dura ? dura : 2000)
}
const openPage = (toOpen, toClose1, msg) => {
    toOpen.style.display = "flex"
    toClose1.style.display = "none"
    msg && openPopUp(msg)
}
const startTheGame = async () => {
    log("clkickex")
    const charDet = sessionStorage.getItem("dungeonborn")
    if(!charDet) return openPopUp("Please Register First")

    const response = await fetch(`${APIURL}/users`,apiOpt('GET', '', charDet.token))
    const data = await response.json()

    if(!data || !response) return openPopUp("Please Check Connection")

    log(data)
}

const checkIfRecordExist = () => {
    
    // if(window.innerWidth < mobileMaxWidth){
    //     document.querySelectorAll(".desk").forEach(elem => elem.style.display = "none")
    //     return continueBtn.style.display = "none"
    // }
    const charDet = JSON.parse(sessionStorage.getItem("dungeonborn"))
    
    if(charDet){
        log("there is record")
        newsContainer.style.display = "none"
        continueBtn.style.display = "block"
        loginPage.style.display = "none"
        if(window.innerWidth < mobileMaxWidth) continueBtn.style.display = "none";
    }else{
        log("walang record")
        continueBtn.style.display = "none"
        loginPage.style.display = "flex"
        homeInputs.forEach(inp => inp.value = '')
        registerBtn.style.display = "none"
        loginBtn.style.display = "block"
        allRegClass.forEach(elemnt => elemnt.style.display = "none")
        if(window.innerWidth < maxWidthForGameplay) loginPage.style.display = "none"
    }
}
function checkScreen(){
    if(window.innerWidth < maxWidthForGameplay) return warningCont.style.display = "flex"
    warningCont.style.display = "none"
}
checkIfRecordExist()

// CLOSE ALL ELEMENTS
function displayElems(arrayOfElem, display){
    arrayOfElem.forEach(elem => elem.style.display = display)
}
function showLoadingScreen(dura, imgName, totalLoad){
    isLoading = true
    lScreen.style.display = "flex"
    lScreen.classList.remove("screenFadeOff");
    loadingCap.innerHTML = loadingWhat
    loadingCap.style.color = `rgb(199, 199, 199)`

    const theTip = tips[Math.floor(Math.random() * tips.length)]
    tipsLabel.innerHTML = theTip.tip

    clearInterval(tipsInterval)
    tipsInterval = setInterval(() => {
        const theTip = tips[Math.floor(Math.random() * tips.length)]
        tipsLabel.innerHTML = theTip.tip
    }, 6000)

    if(dura){
        setTimeout( () => {
            lScreen.classList.add("screenFadeOff")
            setTimeout( () => {
                lScreen.style.display = "none"
                lScreen.classList.remove("screenFadeOff")
            }, 1500)
            clearInterval(loadInterval)
        }, dura)
    }
    if(imgName){
        const loadScreenImg = document.querySelector(".lc-img")
        loadScreenImg.src = `./images/settings/${imgName}.png`
    }
    if(totalLoad){  
        loadedMesh = 0
        loadPercent.style.display = "block"
        clearInterval(loadInterval)
        loadInterval = setInterval(() => {
            loadingCap.innerHTML = loadingWhat
            let perc = loadedMesh / totalLoad * 100
            loadPercent.innerHTML = `${Math.floor(perc)} %`
        }, 50)
        
    }else{
        loadPercent.style.display = "none"
    }
}
function hideLScreen(){
    loadingCap.style.color = "green"
    displayElems([aprtLoadingBx, apartCont], "none")
    displayElems([apartInfos], "flex")
    isLoading = false
    clearInterval(loadInterval)
    clearInterval(tipsInterval)
    lScreen.classList.add("screenFadeOff")
    loadPercent.innerHTML = `100%`
    loadingCap.innerHTML = `creation finish`
    setTimeout( () => {
        lScreen.style.display = "none"
        lScreen.classList.remove("screenFadeOff")
    }, 1400)
}
function removeHomePage(){
    homePage.style.display = "none"
}
function fitScreenWarn(text){
    homePage.innerHTML = ''
    const warnMsg = createElement('p', 'warn-message', text)
    homePage.append(warnMsg)
}
const initAdminPage = () => {
    const socket = io(webSocketURL);
    let toSubmit = {}
    const adminPage = document.querySelector(".admin-page");
    const adminInputs = document.querySelectorAll(".admin-input");
    const adminCreate = document.getElementById("adminCreate");

    adminInputs.forEach(input => {
        input.addEventListener("keyup", e => {
            const {name, value} = e.target
            toSubmit = {...toSubmit, [name]: value }
            log(toSubmit)

            if(toSubmit.spawntype === "sft"){
                let swampforestTreez = []
                let rightT1 = 0
                while(rightT1 <= 60){
                    swampforestTreez.push({ 
                        meshId: Math.random().toString().split(".")[1], 
                        spawntype: "trees", 
                        place: "swampforest", 
                        pos: `${-61 + Math.random() * 20},${rightT1 === 0 ? -75 : -75 + rightT1 + Math.random()}`,
                        hits: 2
                    })
                    rightT1 += 3
                }

                let leftT = 0
                while(leftT <= 60){
                    swampforestTreez.push({ 
                        meshId: Math.random().toString().split(".")[1], 
                        spawntype: "trees", 
                        place: "swampforest", 
                        pos: `${61 + Math.random() * 20},${leftT === 0 ? -75 : -75 + leftT + Math.random()}`,
                        hits: 2
                    })
                    leftT += 3
                }

                let centerFront = 0
                while(centerFront <= 50){
                    swampforestTreez.push({ 
                        meshId: Math.random().toString().split(".")[1], 
                        spawntype: "trees", 
                        place: "swampforest", 
                        pos: `${centerFront === 0 ? -50 : -50 + centerFront + Math.random()}, ${-70 + Math.random() * 40}`,
                        hits: 2
                    })
                    centerFront += 5
                }

                let centerBack = 0
                while(centerBack <= 30){
                    swampforestTreez.push({ 
                        meshId: Math.random().toString().split(".")[1], 
                        spawntype: "trees", 
                        place: "swampforest", 
                        pos: `${centerBack === 0 ? -50 : -50 + centerBack + Math.random()}, ${15 + Math.random() * 50}`,
                        hits: 2
                    })
                    centerBack += 2
                }
                socket.emit(toSubmit.spawntype, swampforestTreez)
                
            }
            if(toSubmit.spawntype === "swmpmons"){
                
                let swampMonsterz = []

                let leftGoblins = -65
                while(leftGoblins <= 10){
                    swampMonsterz.push({ 
                        monsId: makeRandNum(), 
                        place: "swampforest",
                        monsLvl: 2,
                        monsName: "goblin",
                        modelType: "Green",
                        pos: {x: -70 + Math.random() * 10, z: leftGoblins + Math.random() * 2},
                        spd: .03 + Math.random() * .02, 
                        hp: 500,
                        maxHp: 300,
                        atkInterval: 2000, 
                        dmg: 20 + Math.random() * 30,
                        isChasing: false,
                        isAttacking: false,
                        isHit: false,
                        targHero: undefined,
                        expGain: 30
                    })
                    leftGoblins += 10
                }
                let minotaur = -70
                while(minotaur <= 100){
                    swampMonsterz.push({ 
                        monsId: makeRandNum(), 
                        place: "swampforest",
                        monsLvl: 2,
                        monsName: "minotaur",
                        modelType: "",
                        pos: {x: 70 + Math.random() * 10, z: minotaur + Math.random() * 2},
                        spd: .03 + Math.random() * .02, 
                        hp: 1000,
                        maxHp: 500,
                        atkInterval: 2400, 
                        dmg: 20 + Math.random() * 30,
                        isChasing: false,
                        isAttacking: false,
                        isHit: false,
                        targHero: undefined,
                        expGain: 80
                    })
                    minotaur += 30
                }
                socket.emit(toSubmit.spawntype, swampMonsterz)                
            }
            const withDetails = ['sword', 'item', 'treasure']
            withDetails.forEach(detName => {
                if(toSubmit.spawntype === detName) document.querySelector(".ai-itemdet").style.display = "block"
            })
        })
    })
    adminCreate.addEventListener("click", e => {
        const meshId = makeRandNum()
        const itemData = createItemObj(toSubmit)
        let toEmit = {...itemData, place: toSubmit.place, meshId, qnty: 1}
        switch(toSubmit.spawntype){
            case "treasure":
                toEmit = {...toEmit, openingBy: undefined, isOpening: false}
            break
        }
        log(toEmit)
        socket.emit(toSubmit.spawntype, toEmit)
    })
    adminPage.style.display = "block"
    removeHomePage();
}
continueBtn.addEventListener("click", async e => {
    const charDet = JSON.parse(sessionStorage.getItem("dungeonborn"))
    if(!charDet) return window.location.reload()
    log("sessionStorage dungeonBorn found...")
    log("Proceed to Play Game.. evaluate token")
    checkScreen()
    try {
        showLoadingScreen(false, 'wizard', false)
        const response = await fetch(`${APIURL}/users/${charDet.details._id}`, apiOpt('GET', null, charDet.token))
        const data = await response.json()

        if(data === "norecord" || !data){
            hideLScreen()
            openPopUp("Record Can't be found ...")
            localStorage.removeItem("dungeonborn")
            continueBtn.style.display = "none"
            return log("no record")
        } 
        
        theGame = new App(data)
        sessionStorage.setItem("dungeonborn", JSON.stringify(data))
        return
    } catch (error) {
        loadPercent.innerHTML = "Check Internet Connection"
        log(error)
        sessionStorage.removeItem("dungeonborn")
    }
})
const myGameLogo = document.querySelector(".db-logo")
navChoices.forEach(navBtn => {
    navBtn.addEventListener("click", async e => {
        const classN = e.target.className.split(" ")[1]
        if(classN === undefined) {
            log(e.target.className)
            return log("is undefined")
        }
        
        log(classN)
        
        switch(classN){
            case "news":
                newsContainer.style.display = "flex";
            break
            case "gotoreg":
            loginPage.style.display = "flex"
            homeInputs.forEach(inp => inp.value = '')
            loginBtn.style.display = "none"
            registerBtn.style.display = "block"
            allRegClass.forEach(elemnt => elemnt.style.display = "block")
            log(classN)
            myGameLogo.classList.add("db-placeup")
            break;
            case "gotologin":
            loginPage.style.display = "flex"
            homeInputs.forEach(inp => inp.value = '')
            registerBtn.style.display = "none"
            loginBtn.style.display = "block"
            allRegClass.forEach(elemnt => elemnt.style.display = "none")
            log(classN)
            myGameLogo.classList.add("db-placeup")
            break;
            case "gotoabout":
                aboutCont.style.display="flex"
            break;
        }
    }) 
})
// login page
backToHomeBtns.forEach(backBtn => {
    backBtn.addEventListener("click", () => {
        homeInputs.forEach(inp => inp.value = '')
        checkIfRecordExist()
        loginPage.style.display = "none"
        myGameLogo.classList.remove("db-placeup")
    })
})

loginBtn.addEventListener("click", async () => {
    if(!usernameInp.value || !passwordInp.value) return openPopUp("Fill The Form !")
    const toPOST = {
        username: usernameInp.value, 
        password: passwordInp.value
    }
    checkScreen()
    loadingBtn(loginBtn)
    try {
        const response = await fetch(`${APIURL}/users/login`, apiOpt("POST", toPOST))
        if(!response) return openPopUp("Server Connection Error")
        const data = await response.json()
        if(data === "norecord"){
            backToNormalBtn(loginBtn, "Login")
            return openPopUp("Invalid Username Or Password")
        } 

        if(data.details.isAdmin) return initAdminPage()
        sessionStorage.setItem("dungeonborn", JSON.stringify(data))
        // disposeIntro()
        theGame = new App(data)

    } catch (error) {
        openPopUp("Server Or Connection Failure", 10000)
        homeInputs.forEach(inp => inp.value = '')
        backToNormalBtn(loginBtn, "Login")
        log(error)
    }
})
registerBtn.addEventListener("click", async () => {
    if(!usernameInp.value || !passwordInp.value) return openPopUp("Fill The Form !")
    if(passwordInp.value !== confirmpass.value) return openPopUp("Password Not Match !")
    const toPOST = {
        username: usernameInp.value, 
        password: passwordInp.value
    }
    checkScreen()
    loadingBtn(registerBtn)
    try {
        
        const response = await fetch(`${APIURL}/users/register`, apiOpt("POST", toPOST))
        if(!response) return openPopUp("Server Connection Error")
        const data = await response.json()
        if(data === "exist"){
            backToNormalBtn(registerBtn, "Create")
            return openPopUp("Username Already Exist")
        } 
        log(data)
        // disposeIntro()
        theGame = new App(data)
        
        sessionStorage.setItem("dungeonborn", JSON.stringify(data))
    } catch (error) {
        openPopUp("Server Or Connection Failure", 10000)
        homeInputs.forEach(inp => inp.value = '')
        backToNormalBtn(loginBtn, "Login")
        log(error)
    }

})
abtBackBtn.addEventListener("click", () => {
    log('registered')
    aboutCont.style.display="none"
})

function loadingBtn(theElem){
    theElem.innerHTML = 'Loading ...'
    theElem.classList.add("to-loading-btn")
}
function backToNormalBtn(theElem, text){
    theElem.innerHTML = text
    theElem.classList.remove("to-loading-btn")
}

const willContinue = sessionStorage.getItem('dbcontinue')
if(willContinue){
    log("to reload and continue")
    const myCred = sessionStorage.getItem('dungeonborn')
    if(myCred){
        introLs.style.display = "none"
        showLoadingScreen(false, 'wizard')
        removeHomePage()
        theGame = new App(JSON.parse(myCred))
    }else{
        sessionStorage.removeItem("dbcontinue")
        introLs.style.display = "none"
    }
}

let introDisposables
let loadTimes = 0
function checkLoadIfFinish(maxLoad){
    loadTimes++
    if(loadTimes >= maxLoad){
        
        setTimeout(() => {
            introLs.classList.add("screenFadeOff")
            setTimeout( () => introLs.style.display = "none", 500)
        }, 500)
    } 
}
setTimeout(() => {
    introLs.classList.add("screenFadeOff")
    setTimeout( () => introLs.style.display = "none", 500);
    homeInputs.forEach(inp => inp.value = '')
    registerBtn.style.display = "none"
    loginBtn.style.display = "block"
    allRegClass.forEach(elemnt => elemnt.style.display = "none")
}, 1000)
