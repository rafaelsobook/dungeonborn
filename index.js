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
    {
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

let mobileMaxWidth = 700
let deferredPrompt

// if(window.innerWidth < mobileMaxWidth){
//     installGame.style.display = 'block'
//     console.log("its on mobile mode")
//     window.addEventListener("beforeinstallprompt", e => {
//         log(e)
//         deferredPrompt = e
//     })        
//     installGame.addEventListener("click", e => {
//         if(!deferredPrompt) return fitScreenWarn("The App is already Installed <br /> on your device")
//         deferredPrompt.prompt()
//         deferredPrompt.userChoice
//         .then( choiceResult => {
//             if(choiceResult.outcome === "accepted"){
//                 console.log("User want to install the game")
//             }
//             deferredPrompt = null

//             localStorage.setItem("dbapp", JSON.stringify({isInstalled: true})) === null
//         })
//         .catch(error => console.log(error))
//     })
// }else{
//     installGame.style.display = 'none'
// }
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
const statCloseBtn = document.querySelector(".stat-close")
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
// TOP ADVENTURER DETAILS
const topAdventurersCont = document.querySelector(".alladventurer-detail-cont")
const toplist = document.querySelector(".adc-list")

// ABOUT PAGE
const aboutCont = document.querySelector(".about-container")
const abtBackBtn = document.querySelector(".back-btn")

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
let Monsterz = []
let simpleNpc = []

let theBonFirez = []
let theFlowerz = []
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
let goblinRoot
let minotaurRoot
let snakeRoot
let golemRoot
let cam
let shadowGen
let allsword
let sharpRock
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
function makeRandomRange(num){
    return Math.floor(Math.random()*num)
}
function closeGameUI(){
    rightLowerUI.style.display = "none"
    rightUpperUI.style.display = "none"
}
function openGameUI(det){
    rightLowerUI.style.display = "block"
    rightUpperUI.style.display = "flex"
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
class App{
    constructor(userdet){
        this._engine = new Engine(canvas, true)
        this._scene = new Scene(this._engine)
        const tryCam = new FreeCamera("asdfw", new Vector3(0,0,0), this._scene)

        this.userId = userdet.details._id
        this.token = userdet.token
        this.socket = null
        
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
        this.physicalX = 15
        this.weaponX = 20
        this.magX = 30

        this.hpRegenInterval
        this.mpRegenInterval
        this.spRegenInterval

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

        // Tyoes of attacks
        this._atkNum = 0
        this._meeleeNum = 0
        this._weaponAtk = "slash.0" // slash.0 slash.1
        this._meeleAtk = "meelee0" // kick // meelee0 melee1


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
    }
    setHTMLUI(data){
        const { sword, def, core, magic} = data.stats
        const labelsOfStats = document.querySelectorAll(".eqpd-int")
        const myApts = [];
        this.det.aptitude.forEach(apts => myApts.push(apts.name)) 
        labelsOfStats.forEach(statpwr => {
            if(statpwr.className.includes('sword')) statpwr.innerHTML = `Lvl ${sword}`
            if(statpwr.className.includes('def')) statpwr.innerHTML = `Lvl ${def}`
            if(statpwr.className.includes('core')) statpwr.innerHTML = `Lvl ${core}`
            if(statpwr.className.includes('magic')) statpwr.innerHTML = `Lvl ${magic}`
        })
        const myStat = document.querySelector(".mystatus")
        myStat.childNodes.forEach(elem => { // HP AND MP ELEMENT
            if(elem.className && elem.className.includes('hplabel')) elem.innerHTML = `Health: ${Math.floor(data.hp)}/${data.maxHp}`
            if(elem.className && elem.className.includes('mp')) elem.innerHTML = `Mana: ${Math.floor(data.mp)}/${data.maxMp}`
            if(elem.className && elem.className.includes('sp')) elem.innerHTML = `Stamina: ${Math.floor(data.sp)}/${data.maxSp}`
            if(elem.className && elem.className.includes('exp')) elem.innerHTML = `Exp: ${Math.floor(parseInt(data.exp)/parseInt(data.maxExp) * 100)}%`
            if(elem.className && elem.className.includes('str')) elem.innerHTML = `Physical Damage: ${this.det.stats.core * this.physicalX}`
            if(elem.className && elem.className.includes('weaponDmg')) elem.innerHTML = `Plus Weapon Damage: ${this.det.stats.sword * this.physicalX}`
            if(elem.className && elem.className.includes('deftotal')) elem.innerHTML = `Body Defense: ${Math.floor(this.recalPhyDefense(0))}`
            if(elem.className && elem.className.includes('magicDmg')) elem.innerHTML = `Magic Damage: ${Math.floor(this.det.stats.magic * this.magX)}`
            if(elem.className && elem.className.includes('speed')) elem.innerHTML = `Speed: ${Math.floor(this.det.stats.spd)}`
            if(elem.className && elem.className.includes('apts')) elem.innerHTML = `Aptitudes: ${myApts.join(" ")}`
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
    popItemInfo(itemDet, cback){
        log("pop up now")
        this._allSounds.itemEquipedS.play()
        const newBx = createElement("div", "topick-bx")
        const imgBx = createElement("div", "topick-img-bx")
        const topickCap = createElement("p", "topick-cap")
        topickCap.innerHTML = 'Item drop'
        
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
                    this.obtain(itemDet.name,1,false)
                    
                break
            }
            newBx.classList.add("scale-down")
        })
        
        newBx.style.left = `${13 + Math.random()*40}%`
        document.body.append(newBx);
        newBx.classList.add("scale-show")
    }
    showSideNotif(parentElem, notifMessage){
        sideNotif.style.display = "block"
        
        parentElem.append(sideNotif)
        sideNotif.innerHTML = notifMessage
        sideNotif.classList.add("sideAnimate")
        setTimeout(() => {
            sideNotif.style.display = "none"
            sideNotif.classList.remove("sideAnimate")
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
        log(this.myChar.mode);

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
    }
    stopPress(stopSound){
        this._canpress = false
        canPress = false

        if(!this.myChar) return
        if(stopSound) this.myChar.runningS.stop();
    }
    blurButtons(btns){
        btns.forEach(btn => {
            btn.pointerEvents = 'none'
            btn.style.opacity = .5
        })
    }
    returnButtons(btns){
        btns.forEach(btn => {
            btn.pointerEvents = 'visible'
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
    getMyPos(playerBx, localT){
        const inviMesh = new BABYLON.TransformNode("aswa", scene, false)
        const myFoz = playerBx.position
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
            log(data)
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
    async upgrade(statName, willSave){
        let data = await this.getCharacDetailsOnline()

        if(data.points <= 0) return log("not enough points")
        switch (statName) {
            case 'sword':
                data.stats.sword += 1
            break;
            case 'def':
                data.stats.def += 1
            break;
            case 'core':
                data.stats.core += 1
                data.maxHp += 50
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
    async expGain(exp){
        let excessExp = 0
        this.det.exp += parseInt(exp)
        if(this.det.exp >= this.det.maxExp){
            excessExp = this.det.exp - this.det.maxExp
            this.det.exp = excessExp
            this.det.maxExp = this.det.maxExp*2

            this.det.points +=1
            this.det.lvl += 1
            this.det.hp = this.det.maxHp
            this.det.mp = this.det.maxMp
            this.det.sp = this.det.maxSp
            log(this.det)
            this.setHTMLUI(this.det)
            await this.updateMyDetailsOL(this.det, false)
            this.showTransaction(`Level Raised To ${this.det.lvl}`, 1500)
            this._allSounds.congratsS.play()
            return log(this.det)
        }
        log('exp gained ' + this.det.exp)
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
        }, dura)

    }
    closeRedUI(){
        apartCont.style.display = "none"
        apartInfos.style.display = "flex"
        aprtLoadingBx.style.display ="none"
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
            const pricebtn = createElement("button", "shopitem-btn", `sell ${item.price}`, async () => {
                await this.deductItem(item.meshId, 1)
                this.det.coins+=parseInt(item.price)
                await this.updateMyDetailsOL(this.det)
                this._allSounds.coinReceivedS.play()              
                this.showTransaction(`${item.name} Successfully Sold`, 1600)
                this.setSellItems(this.det.items, toAvoids)          
            })
            newDiv.append(pricebtn)
            shopList.append(newDiv)
        })
    }
    setToBuyItems(items){
        shopList.innerHTML = ''
        shopCateg.innerHTML = `My coins: ${this.det.coins}`
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
                const toSave = {...item, meshId: makeRandNum(), qnty: 1}
                if(item.price > this.det.coins) return this.showTransaction("Not Enough Coins", 800)
                shopList.classList.add("cannot-click")
                this.showTransaction(`Buying ${item.name} ...`, false)
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
        log(this.det.items)
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
    unEquip(itemInfo){
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
                if(this.myChar.mode === "weapon"){
                    this.myChar.mode = "fist"
                    this.keepSword(this.myChar.rootSword, this.myChar.rootBone)
                    this.changeAtkBtnImg()
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
    checkAllMyCrafts(){
        craftCont.style.display = "flex"
        const toCraftList = document.querySelector(".to-crafts")
        toCraftList.innerHTML = ''
        if(!this.det.mycrafts.length) return
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
                        log(requiredItem.name)
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
                                if(!this.socketAvailable) this.craftBonFire({x: bonFPos.x, y: bonFPos.y, z: bonFPos.z}, this._scene)
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
                                // if(this.socketAvailable) this.socket.emit("plant-bonfire", 
                                // {meshId: makeRandNum(), pos: {x: bonFPos.x, y: bonFPos.y, z: bonFPos.z}, place: this.currentPlace });
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
    setEventListeners(){
        toCraftCont.addEventListener("click", e => {
            const theTargBtn = e.target.innerHTML
            if(theTargBtn.includes(" ")) return log('this is not it')
            if(!this.canDropHere || !this.craftFunc) return this._statPopUp('cannot craft here', 100, "crimson");
            if(theTargBtn === "cancel") return this.cancelCraft()
            return this.craftFunc()
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
                            const divBackImg = createElement("img", "myquest-backimg")
                            divBackImg.src="./images/setup/scroll.png"
                            newDiv.append(divBackImg)
                            const newImg = createElement("img", "myquest-img")
                            if(myqst.questPicName !== ""){
                                newImg.src = `./images/questpics/${myqst.questPicName}.png`
                            }else{
                                newImg.src = `./images/loots/${myqst.questTarget.targetName}.png`
                            }
                            const qstTtle = createElement("p", "myquest-ttle", myqst.title)
                            const qstDef = createElement("p", "myquest-defi", myqst.def)
                            const qstDemNumber = createElement("p", "myquest-demand", `required: ` +myqst.demandNumber)
                            newDiv.append(newImg)
                            newDiv.append(qstTtle)
                            newDiv.append(qstDef)
                            newDiv.append(qstDemNumber)
    
                            advQuestLists.append(newDiv)
                            
                            newDiv.addEventListener("click", () => {
                                rewardInfo = myqst
                                this.showQuestInfo(true)
                                log(myqst)
                            })
                        })
                    break
                    case "mystats":
                        myStatContainer.classList.remove("my-stat-hidding")
                    break
                }
            })
        })
        rightLowerUI.addEventListener("click", e => {
            const btnName = e.target.className
            if(!btnName.includes("mode-btn")) return log("not a mode btn")
            let modeName
            myCharDet.runningS.setPlaybackRate(1.2)
            if(this.currentPlace === "guildhouse" || this.currentPlace.includes("apartment")) myCharDet.runningS.setPlaybackRate(1)
            if(btnName.includes("swordpic")){
                if(this.det.weapon.name === "none") return
                myCharDet.runningS.setPlaybackRate(1.2)
                if(this.currentPlace === "guildhouse" || this.currentPlace.includes("apartment")) myCharDet.runningS.setPlaybackRate(1)
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
                    } ,510)
                }
                modeName = "weapon"
            }
            if(btnName.includes("handpic")){
                
                this.changeAtkBtnImg()
                if(this.myChar.mode === "stand"){
                    this.playAnim(this.myChar.anims, "fromstand")
                    this.setMode("fist", 500)
                }
                if(this.myChar.mode === "weapon"){
                    this.keepSword(this.myChar.rootSword, this.myChar.rootBone)
                    this.playAnim(this.myChar.anims, "tostand")
                    setTimeout(() => this.playAnim(this.myChar.anims, "fromstand"), 300)
                    this.setMode("fist", 600)
                }
                
            }
            if(btnName.includes("walkpic")){    
                myCharDet.runningS.setPlaybackRate(.9)
                if(this.currentPlace === "guildhouse" || this.currentPlace.includes("apartment")) myCharDet.runningS.setPlaybackRate(.8)
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
                    } ,450)
                }
                if(this.myChar.mode === "fist"){
                    this.myChar.mode = "none"
                    this.playAnim(this.myChar.anims, "fromfist")
                    setTimeout(() => {
                        this.myChar.mode = "stand"
                        myCharDet.mode = "stand"
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
                    this.myChar.whoopS.setPlaybackRate(.8)
                    this.myChar.whoopS.play(.3)
                    this._atkNum++
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
            //means we're sleeping
            if(this.targetRecource.name === "bedleave"){
                doingCont.style.display = "none"
                this.myChar.mode = "stand"
                openGameUI()
                this.allCanPress()
                this.myChar.bx.position.y = this.yPos
                log("waking up from bed leave")
                this.updateMyDetailsOL(this.det, false);
                return clearInterval(restingInterval)
            }
            if(this.targetRecource.name.includes("bed")){
                doingCont.style.display = "none"
                this.myChar.bx.parent = null
                this.myChar.bx.position = new Vector3(2,this.yPos,2.6)
                this.myChar.mode = "stand"
                openGameUI()
                this.allCanPress()
                this._allSounds.woodCreakS.play()
                if(this.det.storyQue.some(storyName => storyName === "wakingUp")){
                    log("waking up from tutorial");
                    
                    closeGameUI()
                    this.stopPress()
                    this.myChar.mode = "none"
                    this.playAnim(this.myChar.anims, "standlooking")
                    const oneSpeechInStart = oneIntroSpeech.map(spch => spch.name === '' ? {...spch, name: this.det.name} : spch)
                    this.continuesSpeech(oneSpeechInStart, 0, 2000, () => {   
                        setTimeout(() => {
                            this.setQuestions(objectivesChoices, "Choose Main Objective", (det) => {
                                this._allSounds.skillAcquiredS.attachToMesh(this.myChar.bx)
                                this._allSounds.skillAcquiredS.setPlaybackRate(.9 + Math.random()*.2)
                                this._allSounds.skillAcquiredS.play()
                                this.transCloseElem(questionCont, 2000)
                                let oneLastMesseg = [{name: "One", message: det.desc}, {name:"One", message: "Choose A Blessing You wish to receive"}]
                                if(det.name === "freedom") oneLastMesseg = [{name: "One", message: "You are always free ..."},{name: "One", message: "But Be Careful, You can only have it Once" }]
                                this.continuesSpeech(oneLastMesseg, 0, 3000, async () => {
                                    this.det.storyQue = this.det.storyQue.filter(strQ => strQ !== "wakingUp");
                                    await this.updateMyDetailsOL({...this.det,mainObj: { name: det.name, dn:det.dn} }, true);
                                    if(det.name === "freedom") {
                                        this.allCanPress()
                                        openGameUI()
                                        this.myChar.nameMesh.isVisible = true
                                        this.myChar.playerHealthMesh.isVisible = true
                                        return this.myChar.mode = "stand"
                                    }
                                    setTimeout(() => {
                                        const secMess = "When you go out I want you to find an Adventurer named Niko, He's expecting you"
                                        const thirdMess = "He can help you how to survive in this world, Find the guild house and you can find him there"
                                        const fourthMess = "I don't have much time now ... farewell and Goodluck"
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
                        }, 2400)
                    })
                }
                return clearInterval(restingInterval)
            }
        })
        pacBtn.addEventListener("click", async e => {
            let recName
            let emitName
            let emitData
            clearInterval(this.hitRecourceInterval)
            if(this.targetRecource === undefined) return
            if(this.targetRecource === 'merchant'){
                this.closePopUpAction()
                this.stopMyCharacter()
                clearTimeout(this._attackTimeout)
                this.continuesSpeech([{name: "Zeenan",message: "Hi I'm zeenan, A Traveling Merchant ..."}, {name: "Zeenan",message: "Maybe We Could Do Some Business ..."}],0,2500,() => {
                    setTimeout(() => merchantChoice.style.display = "flex", 2400)
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
                        newDiv.append(newImg)
                        newDiv.append(foodName)
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
                if(this.targetRecource.name.includes("walker")){
                    this.targetRecource.lookAt(new Vector3(x, this.yPos,z),0,0,0)
                    simpleNpc = simpleNpc.map(npz => npz._id === this.targetRecource.name.split(".")[1] ? {...npz, _talking: true, _moving: false} : npz)
                    const theNpz = simpleNpc.find(npz => npz._id === this.targetRecource.name.split(".")[1])
                    if(!theNpz) return log("not found ")
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
                                        this.showSideNotif(craftIcon, "Craft Added")
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
                                this.playerLookAt(theNpz.bx, {...theNpz.dirTarg, y: this.yPos})
                            })
                        break
                    }
                }else{
                    this.targetRecource.lookAt(new Vector3(x, this.yPos,z),0,0,0)
                    this.stopMyCharacter()
                    clearTimeout(this._attackTimeout)
                    const theTalkingNpc = simpleNpc.find(npz => npz._id === this.targetRecource.name.split(".")[1])
                    switch(theTalkingNpc.name){
                        case "niko":
                            const notYetSpoken = this.det.storyQue.some(stryName => stryName === "firstFriend")
                            const initNikoChoices = () => {
                                this.stopPress()
                                closeGameUI()
                                const lastSpeechConvo = [{name: "Niko", message: "You can register As An Adventurer In the guild, If you want some extra earning"},
                                {name: "Niko", message: "But Be Careful Only Accept Quest that you think you can ..."},
                                {name: "Niko", message: "If you are having a hard time surviving In the wild"},
                                {name: "Niko", message: "You can find my friend Jericho In this Village, He knows crafting"},
                                {name: "Niko", message: "Goodluck on your journey ..."},
                                ]
                                const friendLastSpeech = () => {
                                    setTimeout(() => {
                                        this.continuesSpeech(lastSpeechConvo, 0, 3000, () => {
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
                                            speech: [{name: "Niko", message: "You can use this potion If ever your life is in danger"}]
                                        },
                                        {
                                            name: "info",
                                            dn: "Information"
                                        },
                                        {
                                            name: "none",
                                            dn: "I'm Fine",
                                            speech: [{name: "Niko", message: "I'm Impressed, You are different from anybody ..."}, {name: "Niko", message: "I wish you good fortune in here ... Good luck"}]
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
                                                    this.continuesSpeech(theBonusInfo.speech("Niko"), 0, 5500, () => {
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
                                                    {name: "Niko", message: "If you want to earn some experience and earn money, Register On A Guild"},
                                                    {name: "Niko", message: "But Be Careful Only Accept Quest that you think you can ..."},
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
                            this.continuesSpeech(this.targDetail, 0, 2900, notYetSpoken ? initNikoChoices: undefined)
                        break
                        default:
                            this.continuesSpeech(this.targDetail, 0, 4000, () => openGameUI())
                        break
                    }
                }
                
                return myCharDet.runningS.setPlaybackRate(.85)
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
                this.socketAvailable && this.socket.emit("pickSword", {_id: this.det._id, meshId: this.targDetail.meshId })
                setTimeout(() => {
                    this.obtain(this.targDetail.name, 1, false)
                    this.targetRecource.dispose()
                    this.targetRecource = undefined
                }, 300)
                await this.addToInventory(this.targDetail)
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
                    await this.obtain(this.targDetail.name, 1, false)
                    this.targetRecource.dispose()
                    this.targetRecource = undefined
                    // this.Treasures = this.Treasures.filter(treasure => treasure.meshId !== this.targDetail.meshId)
                    await this.addToInventory({...this.targDetail, qnty: 1})
                })
            }
            log(emitData)
            this.socketAvailable && this.socket.emit(emitName, emitData)       
            
            if(this.targetRecource.name.includes("treasure")) return
            log(recName)
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
        equipedItemsCont.style.display = "flex"
        equipedList.forEach(elem => {
            elem.addEventListener("click", e => {
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
            })
        })
        toCookList.addEventListener("click", async e => {
            if(e.target.className === 'tocook-list') return log('teturn')
            this.myChar.anims.forEach(anim => anim.stop())
            const foodName = e.target.className.split(" ")[1]
            const foodDet = foodInfo.find(food => food.name === foodName)
            const itemDet = this.det.items.find(food => food.name === foodName)
            if(!foodDet) return log('not found food');
            if(!itemDet) return log('not found food in items');

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
                        theFoodDN = 'minotaur meat'
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
                            if(!this.socketAvailable) return this.craftBonFire(bonFPos, this._scene)
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
            const itemName = theItemDetail.name
            const itemInfo = records.find(rec => rec.name === itemName)
            if(!itemInfo) return log("item not found")

            itemInfoCont.style.display = "block"
            
            if(itemInfo.itemType === "seed"){
                itemInfoImg.src = `./images/loots/seed.png`
            }else{
                itemInfoImg.src = `./images/loots/${itemInfo.name}.png`
            }            
            itemInfoName.innerHTML = itemInfo.dn
            itemDesc.innerHTML = itemInfo.desc

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
            itemInfoBtns.innerHTML = ''
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
            if(itemInfo.itemType === "food"){
                let nameOfBtn = "Eat"
                const theFood = foodInfo.find(food => food.name === itemInfo.name)
                if(theFood.name.includes("potion"))nameOfBtn = "use"
                const aBtn = createElement("button", "plantseed item-infobtn", nameOfBtn,async () => {
                    
                    if(!theFood) return log("food not found")
                    if(!theFood.name.includes("potion")){
                        //means ordinary food
                        const plusHealth = this.det.maxHp * theFood.plusHealth
                        this.det.hp += plusHealth
                        this.det.survival.hunger += parseInt(theFood.plus);
                    }else{
                        //means potion
                        this.det.hp += theFood.plus
                    }
                    this._allSounds.consumeS.setPlaybackRate(.9 + Math.random()*.2)
                    this._allSounds.consumeS.play()
                    if(this.det.hp > this.det.maxHp) this.det.hp = this.det.maxHp-1
                    this.updateSurvival_UI()

                    if(this.det.survival.hunger > 100) this.det.survival.hunger = 100
                    
                    this.updateLifeManaSpGUI()
                    this.updateLifeMesh();
                    log(theItemDetail.meshId)
                    await this.deductItem(theItemDetail.meshId, 1)      
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
                    this.det.weapon = theItemDetail
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
            log(theItemDetail)
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
        statCloseBtn.addEventListener("click", e => {
            myStatContainer.classList.add("my-stat-hidding")
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

        speechCont.append(createElement('p', 'speaker-name', arrayOfSpeech[startPage].name, false))         
        speechCont.append(createElement('p', 'speaker-speech', arrayOfSpeech[startPage].message, false))
        
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
    gameOver(){
        setTimeout(() => {
            this.openStoryWritten(0, ['I Told You Not <br/> To Die', "You Died"], async () => {
                await this.useFetch(`${APIURL}/characters/delete/${this.det._id}`, "DELETE", this.token)
                if(this.det.quests.length){
                    delete this.det.quests[0]._id
                    await this.useFetch(`${APIURL}/quests/save`, "POST",undefined, this.det.quests[0])              
                    this.det.quests = []
                    await this.updateMyDetailsOL(this.det, false)
                }
                setTimeout(() => window.location.reload(), 4000)
            })
        }, 2000)
    }
    // ACTIONS WHEN HIT
    playerDeath(player){
        player.mode = "none"
        player.diedS.play()
        this.playAnim(player.anims, 'death', true)
        // player.meshes[0].parent = null
        const {x,y,z} = player.bx.position
        // player.meshes[0].position = new Vector3(x,0,z)
        
    }
    stopFarming(thePlayer){
        thePlayer._minning = false
        thePlayer._training = false
        this.stopAnim(thePlayer.anims, "minning")
        this.stopAnim(thePlayer.anims, "upperkick")
    }
    animStopAll(thePlayer, arrayOfAnim){
        thePlayer._moving = false
        thePlayer._minning = false
        thePlayer._training = false
        thePlayer._attacking = false
        
        if(arrayOfAnim){
            arrayOfAnim.forEach(animName => {
                this.stopAnim(thePlayer.anims, animName)
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
    monsterIsHit(monsId, playerPos, dmgTaken, monspos, mode, isCritical){
        const monster = Monsterz.find(mons => mons.monsId === monsId)
        if(!monster) return log("did not found the monster")
        
        monster.isHit = true
   
        let monsHaveBlood = true
        const monsFos = monster.body.position
        switch(mode){
            case "weapon":
                monster.sliceHitS.play()
                if(monster.monsName.includes("slime")) monsHaveBlood = false
                if(monster.monsName.includes("ghost")) monsHaveBlood = false
                if(monsHaveBlood){
                    switch(monster.monsName){
                        case "golem":
                            //will not create blood particle
                        break
                        default:
                            this.createBloodParticle("blood",300, monsFos, "sphere", true, 1, true, undefined)
                        break
                    }
                }
            break
            case "throw":
                log("throw")
                monster.spearStruck.play()
                if(monster.monsName.includes("slime")) monsHaveBlood = false
                if(monster.monsName.includes("ghost")) monsHaveBlood = false
                if(monster.monsName.includes("golem")) monsHaveBlood = false
                if(monsHaveBlood){
                    this.createBloodParticle("blood",300, monsFos, "sphere", true, 1, true, undefined)
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
        
        log(`monsterHP: ${monster.hp} - ${dmgTaken}`)
        monster.hp -= dmgTaken
        monster.robHealthGui.width = `${(parseInt(monster.hp)/parseInt(monster.maxHp) * 100) * 4}px`;
        log(`monsterHP: ${monster.hp}`)

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

            this.socketAvailable && this.socket.emit("monsDied", {monsId})
            this.removeToBash({_id: monster.monsId})          
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

        setTimeout(() => {
            theMons.body.dispose()
        }, 40000)
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
        log(theMonster.body)
        theMonster.body.position = new Vector3(monsBodyPos.x, monsBodyPos.y,monsBodyPos.z)
        
        this.playerLookAt(theMonster.body, {x: targPos.x, z: targPos.z});
        
        this.playAnim(theMonster.anims, animName)

        if(!theMonster.monsName.includes("slime")){
            theMonster.weapon.position.y = -3
        }
    }
    reduceDurability(theArmorItem, todeduct){
        log(theArmorItem.itemType)
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
    implementStatus(){

    }
    async hitByNonMultiAI(body, enemBody, dmgTaken, animName, monsId, effects){
        let myDef = this.det.stats.def*2;
        const {x,z} = enemBody.position
        body.lookAt(new Vector3(x,body.position.y,z), 0,0,0)
        this.myChar.weaponCol.position.y = 9
        
        if(this.det.armor.name !== "none") {
            const myArmor = this.det.items.find(itm => itm.meshId === this.det.armor.meshId)
            if(myArmor.cState >= 1){
                myDef+= this.det.armor.plusDef
            
                log("hit -" + dmgTaken/4)
                log(this.det.armor.cState)
                this.det.items.forEach(itm => {
                    if(itm.meshId === this.det.armor.meshId) this.reduceDurability(itm, dmgTaken/4)
                })
            }else{
                this.unEquip(myArmor)
                await this.deductItem(myArmor.meshId, 1)
            }
        }
        if(this.det.gear.name !== "none") {
            const myArmor = this.det.items.find(itm => itm.meshId === this.det.gear.meshId)
            if(myArmor.cState >= 1){
                myDef+= this.det.gear.plusDef
           
                this.det.items.forEach(itm => {
                    if(itm.meshId === this.det.gear.meshId) this.reduceDurability(itm, dmgTaken/4)
                })
            }else{
                this.unEquip(myArmor)
                await this.deductItem(myArmor.meshId, 1)
            }
        }
        if(this.det.helmet.name !== "none") {
            const myArmor = this.det.items.find(itm => itm.meshId === this.det.helmet.meshId)
            if(myArmor.cState >= 1){
                myDef+= this.det.helmet.plusDef
            
                this.det.items.forEach(itm => {
                    if(itm.meshId === this.det.helmet.meshId) this.reduceDurability(itm, dmgTaken/4)
                })
            }else{
                this.unEquip(myArmor)
                await this.deductItem(myArmor.meshId, 1)
            }
        }
        if(this.det.shield.name !== "none") {
            const myArmor = this.det.items.find(itm => itm.meshId === this.det.shield.meshId)
            log(myArmor)
            if(!myArmor) return log("shield not found")
            if(myArmor.cState >= 1){
                myDef+= this.det.shield.plusDef
                this.det.items.forEach(itm => {
                    if(itm.meshId === this.det.shield.meshId) this.reduceDurability(itm, dmgTaken/4)
                })
            }else{
                this.unEquip(myArmor)
                await this.deductItem(myArmor.meshId, 1)
            }
        }

        let toDeduct = myDef >= dmgTaken ? 1 : dmgTaken - myDef
        log('my def ' + myDef + " - dmgtaken " + dmgTaken)
        log(`to deduct in my life ${toDeduct}`)
        this.det.hp -= toDeduct
        log(this.det.status)
        if(effects && effects.chance > Math.random()*10){
            log("there is effect")
            this.det.hp -= effects.plusDmg
            clearTimeout(this._attackTimeout)
            if(this.det.hp >= 0){
                if(!this.det.status.length){
                    this.det.status.push({effectType: effects.effectType, dmgPm: effects.dmgPm});
                }else{
                    const alreadyThere = this.det.status.some(status => status.effectType === effects.effectType)
                    if(!alreadyThere){
    
                    }
                }
                this.implementStatus()
                const myCurrentMode = this.myChar.mode
                this.myChar.mode = effects.effectType
                let colorOfCap = "limegreen"
                switch(effects.effectType){
                    case "poisoned":
                        colorOfCap = "limegreen"
                        const theParticle = this.createBloodParticle("poisonTex", 100, this.myChar.bx.position, "sphere", true, 5, true, false)
                        theParticle.color = new BABYLON.Color3(0.05, 0.18, 0.02)
                    break
                }
                this.createTextMesh(makeRandNum(), effects.effectType, colorOfCap, this.myChar.bx.position, 90,this._scene, true)
                setTimeout(() => {
                    if(this.det.hp <= 0) return
                    this.myChar.mode = myCurrentMode
                    this.allCanPress()
                    openGameUI()
                }, effects.dura)
                log(`duration to continue ${effects.dura}`)
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
            if(this.det.weapon.name !== "none") this.keepSword(this.myChar.rootSword, this.myChar.rootBone)
        }
        if(this.det.hp <= 0){            
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
            return this.playerDeath(this.myChar)
        }
        if(this.myChar._minning || this.myChar._training){
            log("I am minning or training")
            clearInterval(this.hitRecourceInterval)
            this.myChar._minning = false
            this.myChar._training = false
            // this.keepSword(this.myChar.rootSword, this.myChar.rootBone)
            this.myChar.mode = "weapon"
        }
        if(this.myChar._crafting){
            log("our crafting disturbed !")
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
        setTimeout(() => player.mode = "stand", 1300)
        if(player._id === this.det._id){
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
                        if(myqst.currentNumber >= myqst.demandNumber) myqst.isCleared = true
                        showNotif("Quest Cleared", 2000)
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
        await this.updateMyDetailsOL(this.det, false)
    }
    recalMeeleDmg(){
        let totalDmg = 0
        let physicDmg = (this.det.stats.core * this.physicalX) + this.plusCore
        log("my mode " + this.myChar.mode)
        switch(this.myChar.mode){
            case "weapon":
                log("on weapon damage")
                if(!this.det.weapon) return log("no weapon")
                totalDmg = physicDmg + parseInt(this.det.weapon.plusDmg) + this.plusDmg + (this.det.stats.sword * this.weaponX)
                log(totalDmg)
                const minDurability = this.det.weapon.durability/3
                if(this.det.weapon.cState <= minDurability) totalDmg = totalDmg/2
            break;
            case "fist":
                log("on fist damage")
                totalDmg = physicDmg
            break
            case "noneweapon":
                log("on weapon damage")
                if(!this.det.weapon) return log("no weapon")
                totalDmg = physicDmg + parseInt(this.det.weapon.plusDmg) + this.plusDmg + (this.det.stats.sword * this.weaponX)
                log(totalDmg)
            break;
        }
        if(this.det.survival.sleep <= 20){
            totalDmg = totalDmg/2
            log("Im not In Focus")
        }
        log(totalDmg)

        return totalDmg
    }
    recalPhyDefense(dmgTaken){
        let myDef = this.det.stats.def*1.5;
        if(this.det.armor.name !== "none") {
            myDef+= this.det.armor.plusDef
            this.reduceDurability(this.det.armor, dmgTaken/4)
            log("hit -" + dmgTaken/4)
            log(this.det.armor.cState)
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
        log(`enemy registered ... ${this.enemyRegistered.length}`)
        Monsterz.forEach(monster => {
            const alreadyHave = this.enemyRegistered.some(enemId => enemId === monster.monsId)
            if(alreadyHave) return log("this monster is already registered !")
            
            this.myChar.weaponCol.actionManager.registerAction(new ExecuteCodeAction(
                {
                    trigger: ActionManager.OnIntersectionEnterTrigger,
                    parameter: monster.body
                }, async e=>{
                    const themons = Monsterz.find(mons => mons.monsId === monster.monsId)
                                        
                    if(!themons) return
                    let myTotalDmg = parseInt(this.recalMeeleDmg())
                    log(`the monster targ is ${themons.targHero}`)
         
                    this.focusOn = monster.body

                    if(this.myChar.mode === "fist") this.myChar.punchedS.play()
                    // if(themons.targHero !== undefined && !themons.isAttacking){
                    //     let theAttacks = 1.5
                    //     if(themons.monsName === "viper") theAttacks = 2.7
                    //     let randNum = Math.floor(Math.random() * theAttacks);
                        
                    //     if(this.socketAvailable){
                    //         this.socket.emit('monsWillAttack', {
                    //             monsId: themons.monsId, 
                    //             targHero: this.det._id, 
                    //             pos: {x: themons.body.position.x, z: themons.body.position.z},
                    //             atkInt:randNum
                    //         })
                    //     }else{
                    //         this.monsterAttack(themons.monsId, themons.monsName, themons.body.position, this.det._id, `attack${randNum}`)
                    //     }
                        
                    // }
                    
                    if(themons.hp <= myTotalDmg){
                        this.focusOn = null
                        this.det.monsterKilled++
                        
                        const theItem = monsterloot[Math.floor(Math.random() * monsterloot.length)]
                        if(!theItem) return log("the item is undefined")
                        
                        const monsCore = records.find(rec => rec.for === monster.monsName)
                        if(monsCore){
                            const monsCoreItem = {...monsCore, price: monsCore.secondPrice, meshId: makeRandNum(), qnty: 1}
                            
                            await this.addToInventory(monsCoreItem)
                            this.obtain(monsCoreItem.name,1,false)
                        }else log("this monster has no core")

                        if(Math.random() * 10 > 9) this.popItemInfo({...theItem, meshId: makeRandNum(), qnty: 1})
                        
                        // EDIBLE MONSTERS
                        switch(themons.monsName){
                            case "minotaur":
                                const foodDet = { meshId: makeRandNum(), 
                                    name: 'minMeatRaw', itemType: 'food', 
                                    price: 100, qnty: 1}
                                    await this.addToInventory(foodDet)
                                    this.obtain(foodDet.name,1,false)
                            break
                        }
                        log(themons)
                        this.readCheckMyQuest("slay", themons.monsName, themons.monsBreed)
                        await this.expGain(themons.expGain)
                    }
                    let criticalMultiplier = 2
                    const mpos = monster.body.position
                    
                    const myposition = this.myChar.bx.position
                    let isCritical = false;
                    if(this.det.survival.sleep >= 20 && Math.random()*10 < 8) isCritical = true
                    if(isCritical){
                        const critMultiply = Math.floor(Math.random()*(criticalMultiplier+.5));
                        log('Crit multiplied to ' + critMultiply)
                        myTotalDmg = myTotalDmg + myTotalDmg*critMultiply
                    }else{
                        this.createTextMesh(makeRandNum(), myTotalDmg, "red", {x: mpos.x, y: mpos.y,z: mpos.z}, 80, this._scene, true, false)
                    }
                    if(!this.socketAvailable){
                        this.monsterIsHit(monster.monsId, {x: myposition.x, z: myposition.z}, myTotalDmg, {x:mpos.x, z:mpos.z}, this.myChar.mode, isCritical)
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
        if(this.currentPlace === "guildhouse" || this.currentPlace?.includes("apartment")){
            cam.lowerRadiusLimit = 3.5;
            cam.upperRadiusLimit = 4
            log("we are in guild or apartment")
        }
    }
    resetMeshes(){
        theCharacterRoot = undefined
        cam = undefined
        shadowGen = undefined
        allsword = undefined
        light = undefined
        wholeTree = undefined
        allHouses = undefined
    }
    setUp(isSocketAvail){
        this.clearIntervals()
        this.enemyRegistered = [];

        Monsterz = [];
        players = [];

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

        this.canDropHere = true
        this.craftFunc = undefined
        this.toDropMesh = undefined

        moveNums = { straight: 0, leftRight: 0 }
        displayElems([craftIcon], "block")
        let itemElementz = []
        document.querySelectorAll(".topick-bx").forEach(itmElem =>itemElementz.push(itmElem))
        if(itemElementz.length) displayElems(itemElementz, "block")
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
        }
        if(this.det.survival.hunger < 13){
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
        }, (100 - this.det.regens.hp) * 14)
        // MANA
        this.mpRegenInterval = setInterval( () => {
            if(this.det.mp < this.det.maxMp-1) this.det.mp += 1
            this.updateMP_UI()
        }, (100-this.det.regens.mp) * 14)
        // STAMINA
        this.spRegenInterval = setInterval( () => {
            if(this.det.sp <= this.det.maxSp-1) this.det.sp += 1
            this.updateSP_UI()
        }, (100 - this.det.regens.sp) * 5)
        this.updateHunger()
        this.hungerInterval = setInterval(() => {
            this.updateHunger()
            // saling ketket lang tong check body
            this.checkBody()
        }, 40.5 * 1000)
        this.sleepyInterval = setInterval(() => {
            if(this.det.survival.sleep > 0) this.det.survival.sleep-=.2
            if(this.det.survival.sleep < 0.2) this.det.survival.sleep = 0
            this.updateSurvival_UI();
            if(this.det.survival.sleep < 10){
                restStat.parentElement.children[0].style.animation = "blinkingRed .5s infinite"
            }else{
                restStat.parentElement.children[0].style.animation = "none"
            }
        }, 2.2 * 1000)
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
        isMyQuest ? acceptQuestBtn.style.display = "none" : acceptQuestBtn.style.display = "block"
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
    async _loadCharacterSounds(scene){
        const whoop = new BABYLON.Sound("whoopSlash", "sounds/slashWhoosh.wav", scene,
        null, {volume: .2, spatialSound: true, maxDistance: 25, autoplay: false, loop: false})

        const brokenS = new BABYLON.Sound("brokenS", "sounds/brokenS.mp3", scene,
        null, {volume: .5, spatialSound: false, autoplay: false, loop: false})

        const woodFloorS = new BABYLON.Sound("woodFloorS", "sounds/woodFloorS.mp3", scene,
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

        this._allSounds = {
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
            congratsS
        }
 
    }
    setProperSound(){
        switch(this.myChar.mode){
            case "stand":
                myCharDet.runningS.setPlaybackRate(.9)
                if(this.currentPlace === "guildhouse" || this.currentPlace.includes("apartment")) myCharDet.runningS.setPlaybackRate(.8)
            break;
            case "none":
                myCharDet.runningS.setPlaybackRate(.9)
                if(this.currentPlace === "guildhouse" || this.currentPlace.includes("apartment")) myCharDet.runningS.setPlaybackRate(.8)
            break;
            default:
                myCharDet.runningS.setPlaybackRate(1.2)
                if(this.currentPlace === "guildhouse" || this.currentPlace.includes("apartment")) myCharDet.runningS.setPlaybackRate(1)
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

            this.checkAll()
            plOnline.innerHTML = `players online: ${data.uzers.length}`
            // if(theLootz.length){
            //     theLootz.forEach(loot => {
            //         const isMade = this.lootz.some(buto => buto.meshId === loot.meshId)
            //         if(!isMade){
            //             if(loot.itemType === "sword"){
            //                 allsword.forEach(swor => {
            //                     if(swor.name.split(".")[1] === loot.name){
            //                         this.placeSword(loot, swor, .23, scene)
            //                     }
            //                 })
            //             }
            //         }
            //     })
            // }
        })
        
        this.socket.on("deliver-reload", idFromTcp => {
            // means opening same account at the same time in different browsers
            if(this.det._id === idFromTcp) return window.location.reload()
        })
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
        this.checkOrez()
        this.checkTreez()
        this.checkPlayers();
        log("will check Houzes")
        this.checkHouzes()
        this.checkMonsterz()
        this.checkSeedz()
        this.checkBonFirez()
        this.checkTreasurez()
        this.checkFlowers()
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
            if(mesh.name.includes("cloth")) {
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
            regens: {sp: 35, hp: 3, mana: 1},
            z: -30,
            aptitude: getAptitudes(),
            storyQue: ['wakingUp', 'numberOneTalk', 'firstFriend',"firstItem", 'numberTwoTalk'],
            mainObj: { name: "", dn: ""}
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
        await this._loadCharacterSounds(scene)
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
        
        scene.ambientColor = Color3.FromInts(10, 30, 10);
        scene.clearColor = Color3.FromInts(127, 165, 13);

        await this._loadCharacterSounds(scene)

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

        const Ground = await this.createGround(scene, "./images/modeltex/swampFTex.jpg",200)
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

        // SWORDS
        const Sword = await this.importMesh(scene, "./models/", "swords.glb")
        allsword = Sword.meshes[0].getChildren()
        allsword.forEach(swordv => swordv.parent = null)
        
        await this.createWoodPlank();
        this.createDangerSign(scene, {x: -3, y:.6, z: 75}, {x: 0,z:0});
        await this.forestCreations(scene)
        await this.helmetCreation(scene);
        await this.shieldCreation(scene);

        theCharacterRoot = await BABYLON.SceneLoader.LoadAssetContainerAsync("./models/", "gameCharac.glb", scene)
        goblinRoot = await BABYLON.SceneLoader.LoadAssetContainerAsync("./models/mons/", "goblinGreen.glb", scene)
        minotaurRoot = await BABYLON.SceneLoader.LoadAssetContainerAsync("./models/mons/", "minotaur.glb", scene)
        snakeRoot = await BABYLON.SceneLoader.LoadAssetContainerAsync("./models/mons/", "snake.glb", scene)
        golemRoot = await BABYLON.SceneLoader.LoadAssetContainerAsync("./models/mons/", "golem.glb", scene)

        // const Golem = await this.importMesh(scene, "./models/mons/", "golem.glb");
        // Golem.meshes[0].position.z = -31
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

        const TheTreaz = await this.buildTreazure(scene);

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
        
        this.arrangeCam(-1.4, 1.15)

        removeHomePage()
        loadedMesh = maxLoad
        openGameUI(this.det)
        
        this.showMapName('Swamp Forest', 3800);
        this.allCanPress()
        this.initPressControllers(scene)

        this.weJoinTheServer({x:0,z:0})
        this.checkAll();
        
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

        await this._loadCharacterSounds(scene)

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

        const Ground = await this.createGround(scene, "./images/modeltex/hiddenlandTex4.jpg",200)
        Ground.diffuseTex.uScale = 28
        Ground.diffuseTex.vScale = 28
        this.createSwmpTile(scene)

        this.createSwamps("./images/modeltex/grassGround.png", scene, {x: 0, z: 0}, 100,{min: -25, max:25}, {min: -95,max: -130})
        
        const Cliff = await this.importMesh(scene, "./models/", "cliffs.glb")
        Cliff.meshes[1].parent = null
        Cliff.meshes[1].position = new Vector3(-110.9,0,20)
        Cliff.meshes[0] = null;

        // SWORDS
        const Sword = await this.importMesh(scene, "./models/", "swords.glb")
        allsword = Sword.meshes[0].getChildren()
        allsword.forEach(swordv => {
            swordv.parent = null
            swordv.position.y = 100
        })
        
        await this.createWoodPlank();
        this.createDangerSign(scene, {x: -3, y:.6, z: 75}, {x: 0,z:0});
        await this.forestCreations(scene)
        await this.helmetCreation(scene);
        await this.shieldCreation(scene);

        theCharacterRoot = await BABYLON.SceneLoader.LoadAssetContainerAsync("./models/", "gameCharac.glb", scene)
        goblinRoot = await BABYLON.SceneLoader.LoadAssetContainerAsync("./models/mons/", "goblinGreen.glb", scene)
        minotaurRoot = await BABYLON.SceneLoader.LoadAssetContainerAsync("./models/mons/", "minotaur.glb", scene)
        snakeRoot = await BABYLON.SceneLoader.LoadAssetContainerAsync("./models/mons/", "snake.glb", scene)
        golemRoot = await BABYLON.SceneLoader.LoadAssetContainerAsync("./models/mons/", "golem.glb", scene)

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

        const TheTreaz = await this.buildTreazure(scene);

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
        this.checkAll();

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
        this.creationOfFakeShadow(scene)
        scene.actionManager = new ActionManager(scene)
        scene.clearColor = new Color3(0,0,0)
        shadowGen = new ShadowGenerator(1024, light);
        this.disablePointerPicks(scene)

        await this._loadCharacterSounds(scene)
          
        this.runLifeManaStaminaRegen()

        const cam = this.arcCam(scene)
        cam.attachControl(canvas, true)
        cam.checkCollisions = true

        this.createFog(scene,.01)
        this.createBoxToFollow(scene)

        // const Ground = await this.importMesh(scene, "./models/", "dungeonNormal.glb")
        // Ground.meshes.forEach(gr => {
        //     if(gr.name.includes("root")) return
        //     gr.actionManager = new ActionManager(scene)
        //     this.blocks.push(gr)
        // })

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
        // SWORDS
        const Sword = await this.importMesh(scene, "./models/", "swords.glb")
        allsword = Sword.meshes[0].getChildren()
        allsword.forEach(mesh => mesh.parent = null);

        const SharpROCK = await this.importMesh(scene, "./models/", "sharpRock.glb")
        sharpRock = SharpROCK.meshes[1]

        await this.helmetCreation(scene);
        await this.shieldCreation(scene);
        await this.createMagicCircle(scene);
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

        const TheTreaz = await this.importMesh(scene, "./models/", "treasure.glb")
        TheTreaz.meshes[1].parent = null
        treasure = TheTreaz.meshes[1];
        log("done creating treasures")

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
        
        this.myChar = this.createCharacter(this.det,theCharacterRoot,scene, shadowGen,false,true, allsword, allhelmets, allshields, light, 1.7)
        myCharDet = this.myChar;
   

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

        // treasures
        switch(floorNumber){
            case 1:
                const haveHydra = this.det.items.some(item => item.name === "hydra");
                if(!haveHydra){
                    this.createTreasure(treasure, {openingBy: undefined, isOpening: false, x: -10 + Math.random()* 15,z: 90, meshId: makeRandNum(), name: 'hydra', itemType: 'armor', plusDef: 30, plusDmg: 0, 
                    magRes: 0, plusMag: 0, price: 10000, cState: 6000, durability: 6000})
                }
            break;
            case 2:
                const haveKarba = this.det.items.some(item => item.name === "karba");
                if(!haveKarba){
                    this.createTreasure(treasure, {openingBy: undefined, isOpening: false, x: -10 + Math.random()* 15,z: 90, meshId: makeRandNum(), name: 'karba', itemType: 'armor', plusDef: 100, plusDmg: 0, 
                    magRes: 0, plusMag: 0, price: 10000, cState: 6000, durability: 6000})
                }
            break;
        }
        // MONSTERS
        let slimeHp = 70 * floorNumber
        let ghostHp = 150 * floorNumber
        let spiderHp = 290 * floorNumber

        let slimeAtkInterval = 2400;
        let otherAtkInterval = 2000;

        let slimeDmg = 10 * floorNumber
        let ghostDmg = 16 * floorNumber;

        let slimeExpGain = 30 * floorNumber
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
        }

        this.createMonsterToChase(Monsterz, 'ghost', {x: 0, z: -30}, {width: 30}, 0, scene)
        this.createMonsterToChase(Monsterz, 'slime', {x: 0, z: -30}, {width: 30}, 0, scene)
        this.createMonsterToChase(Monsterz, 'slime', {x: 0, z: -70}, {width: 30}, 0, scene)
        this.createMonsterToChase(Monsterz, 'ghost', {x: 0, z: 20}, {width: 30}, 0, scene)
        this.createMonsterToChase(Monsterz, 'ghost', {x: 0, z: 40}, {width: 30}, 0, scene)
        this.createMonsterToChase(Monsterz, 'slime', {x: 0, z: 60}, {width: 30}, 0, scene)
        this.createMonsterToChase(Monsterz, 'eater', {x: 0, z: -30}, {width: 30}, 0, scene)
        this.createMonsterToChase(Monsterz, 'eater', {x: 0, z: 30}, {width: 30}, 0, scene)
        
        this.camSetTarg(this.myChar.camTarg, cam, -Math.PI/2, 5);

        const PathMod = await this.importMesh(scene, "./models/", 'portal.glb')
        PathMod.meshes[1].parent = null; PathMod.meshes[0].dispose()
        PathMod.meshes[1].position.z = -104;

        const startPath = this.createPath(5,  {x: 0, z: -106}, scene)
        startPath.actionManager.registerAction(new ExecuteCodeAction(
            {
                trigger: ActionManager.OnIntersectionEnterTrigger,
                parameter: this.myChar.bx
            }, async e => {
                if(this.currentPlace.includes('dungeon')){
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
                clearInterval(monsSpawnInterval)               
                let floor = parseInt(floorNumber)
                floor +=1
                Monsterz.forEach(mons => {
                    mons.weapon.position.y = 100
                    mons.body.position.y = 100
                    mons.body.dispose()
                })
                await this._dungeon('Normal', floor, true)
                this.myChar.bx.position = new Vector3(0,this.yPos,-94)
                this.arrangeCam(-1.4, 1.15)
                await this.updateLocOnline({x: 0, z:-30}, {x: 0, z: -94})                
            }
        ))

        const gl = new BABYLON.GlowLayer("glow", scene);
        gl.intensity = 1

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


        if(floorNumber > 1){
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
        // for bug issues

        if(this.myChar.bx.position.z === 4) this.myChar.bx.position = new Vector3(0,this.yPos, -95)
        

        Sword.meshes.forEach(mesh => mesh.isVisible = false);
        Crys.meshes.forEach(mesh => mesh.isVisible = false);
        CrysDirt.meshes.forEach(mesh => mesh.isVisible = false);
        TheTreaz.meshes.forEach(mesh => mesh.isVisible = false);
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

        const explodingSmoke = this.createExplodingSmoke()
        this.creationOfFakeShadow(scene)
        // sound
        // const heartLandS = new BABYLON.Sound("sliceHit", "sounds/heartlandS.mp3", scene,
        // null, {volume: .03, autoplay: true, loop: true})

        scene.actionManager = new ActionManager(scene)

        light = new DirectionalLight("dirLight", new Vector3(.4, -3, -.5), scene);
        hemLight = new HemisphericLight("light", new Vector3(0,10,2), scene)
        hemLight.intensity = .7
        light.intensity = .5
        pointLight = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(0, 1,0), new BABYLON.Vector3(0, -1, 0), Math.PI+1, 2, scene);

        shadowGen = new ShadowGenerator(1024, light);
        
        scene.ambientColor = Color3.FromInts(10, 30, 10);
        scene.clearColor = Color3.FromInts(127, 165, 13);

        await this._loadCharacterSounds(scene)

        cam = this.arcCam(scene)

        await this.createGround(scene, "./images/modeltex/swampFTex.jpg",200)

        // this.createHeartLandTile(scene)

        const medHouse = await this.importMesh(scene, "./models/", "medhouse1.glb")
        medHouse.meshes[0].position = new Vector3(0,0,-30)
        allHouses = medHouse.meshes[0].getChildren();

        await this.createWoodPlank();
        this.createHLPlanks()
        
        // SWORDS
        const Sword = await this.importMesh(scene, "./models/", "swords.glb")
        allsword = Sword.meshes[0].getChildren();

        await this.helmetCreation(scene);
        await this.shieldCreation(scene);

        theCharacterRoot = await BABYLON.SceneLoader.LoadAssetContainerAsync("./models/", "gameCharac.glb", scene)
        // box to follow && character
        const btf = this.createBoxToFollow(scene)
        this.myChar = this.createCharacter(this.det, theCharacterRoot, scene, shadowGen, false,true, allsword, allhelmets, allshields, light, 1.7)
        myCharDet = this.myChar

        npcInfos.forEach(npz => {
            const notYetTalked = this.det.storyQue.some(stryName => stryName === "firstFriend")
            if(npz.name === "niko" && !notYetTalked) return
            this.createNpc(theCharacterRoot, npz, false, btf)
        })
        await this.createMerchant(scene, {x: -7,y:0,z:53.5}, {x: -1.8, z: 52})

        const wagon = await this.importMesh(scene, "./models/", "wagon.glb")
        wagon.meshes[1].parent = null
        wagon.meshes[1].position = new Vector3(15,0,59);
        wagon.meshes[1].rotationQuaternion = null
        wagon.meshes[1].lookAt(new Vector3(-25.33,0,69), 0,0,0)
        this.blocks.push(wagon.meshes[1])
        this.putFakeShadow(wagon.meshes[1], 8, .07)
        this.freeze(wagon.meshes[1])

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

        await this.outGateC(scene, {x: 0,y:0,z:-83})

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

        const treasure = await this.importMesh(scene, "./models/", "treasure.glb")
        treasure.meshes[1].parent = null

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
                const nikNpc = simpleNpc.find(npz => npz.name === "niko");
                if(nikNpc){
                    closeGameUI()
                    
                    const npcInfo = npcInfos.find(npz => npz.name === "niko")
                    this.targetRecource = nikNpc.bx
                    this.targDetail = npcInfo.condition(this.det);
                    pacBtn.click()
                    this.closePopUpAction()
                    closeGameUI()
                }else{
                    log("niko not found")
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
        // this.checkAll();
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
        Sword.meshes.forEach(mesh => mesh.isVisible = false)
        treasure.meshes.forEach(mesh => mesh.isVisible = false)
        window.innerHeight < 650 && this._makeJoyStick(this.socket, cam,scene, true)
        this.registerBlocks(this.myChar, .09)
        Tree.meshes[0].position.y = 100
        // CREATING THE GUILD HOUSE
        allHouses.forEach(allh => allh.position.y += 100)

        const TheGuildHL = await this.importMesh(scene, "./models/", "guildHouseHL.glb")
        const guildHL = TheGuildHL.meshes[1];guildHL.rotationQuaternion = null
        log(guildHL )
        guildHL.parent = null;
        // TheGuildHL.meshes[0].dispose();
        guildHL.checkCollisions = true
        guildHL.position = new Vector3(0,0,61);
        const guildEntrance = MeshBuilder.CreateGround('guildEntr', {height: 3, width: 2}, scene)
        guildEntrance.position = new Vector3(0,.5,57.5);
        guildEntrance.visibility = false
        this.createTextMesh(makeRandNum(), "Guild", "white", {x: 0, y: 3, z: 56.2 }, 100, scene, false)
        this.toRegAction(this.myChar.bx, guildEntrance, () => {
            this.openPopUpAction("info")
            this.targetRecource ='guildhouse'
            const myF = this.myChar.bx.position
            this.prevLoc = {x: myF.x, z:myF.z}
        })
        this.toRegActionExit(this.myChar.bx, guildEntrance, () => {
            this.closePopUpAction()
            this.targetRecource = undefined
        })
        this.toRegAction(this.myChar.bx, guildHL, () => {
            this.stopPress(true)
            this.bump(this.myChar);
            const mypos = this.myChar.bx.position
            this.socketAvailable && this.socket.emit('userBump', {_id: this.det._id, pos:{ x: mypos.x, z: mypos.z }, 
            dirTarg: {x: this.btf.position.x, z: this.btf.position.z} })
            setTimeout(() => this.allCanPress, 2000)
        })

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

        await this._loadCharacterSounds(scene)
        this.creationOfFakeShadow(scene)

        this.runLifeManaStaminaRegen()
        const cam = this.arcCam(scene)
        this.createBoxToFollow(scene)

        // const theHouse = await this.importMesh(scene, "./models/", "medRooms.glb")
        // theHouse.meshes.forEach(mesh => mesh.receiveShadows = true)
        
        oldHouseMesh = MeshBuilder.CreateBox("house", { width: 9, height: .15, depth: 12}, scene)
        oldHouseMesh.position = new Vector3(0,-.075,2.4)
        const oldHouseMat = new StandardMaterial("oldHouseMat", scene)
        const diffuseTex = new Texture("./images/modeltex/planks.jpg", scene)
        oldHouseMat.diffuseTexture = diffuseTex
        oldHouseMesh.material = oldHouseMat
        oldHouseMat.specularColor = new Color3(0,0,0)
        diffuseTex.vScale = 6
        diffuseTex.uScale = 6
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
        // SWORDS
        const Sword = await this.importMesh(scene, "./models/", "swords.glb")
        const allsword = Sword.meshes[0].getChildren()
        allsword.forEach(mesh => mesh.parent = null)

        await this.helmetCreation(scene);
        await this.shieldCreation(scene);

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

        await this.createMagicCircle(scene)
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
            this.checkAll();
        })

        Sword.meshes.forEach(mesh => mesh.isVisible = false)
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

        await this._loadCharacterSounds(scene)

        this.runLifeManaStaminaRegen()
        const cam = this.arcCam(scene)
        const btf = this.createBoxToFollow(scene)

        const theHouse = await this.importMesh(scene, "./models/", "guildHouse.glb")
        theHouse.meshes.forEach(mesh => mesh.receiveShadows = true)

        const bulletinBoard = await this.importMesh(scene, "./models/", "board.glb")
        bulletinBoard.meshes[0].position = new Vector3(0,1,8.21)

        const Book = await this.importMesh(scene, "./models/", "book.glb")
        Book.meshes[0].position = new Vector3(0,1.2,5.5);

        await this.createMagicCircle(scene)
        
        // SWORDS
        const Sword = await this.importMesh(scene, "./models/", "swords.glb")
        allsword = Sword.meshes[0].getChildren()
        allsword.forEach(mesh => mesh.parent = null);
        await this.helmetCreation(scene);
        await this.shieldCreation(scene);

        let theCharacterRoot = await BABYLON.SceneLoader.LoadAssetContainerAsync("./models/", "gameCharac.glb", scene)
        this.myChar = this.createCharacter(this.det,theCharacterRoot,scene, shadowGen,true,true, allsword, allhelmets, allshields, light, 1.7)
        myCharDet = this.myChar;
        this.myChar.bx.position = new Vector3(0,this.yPos,0);

        // GUILD MASTER
        const toWear = {cloth: 'grand', pants: 'magios', hair: 'aegon', boots: 'silver'}
        const npc = await this.createNormalNpc(scene, BABYLON, { x: 0, z: 6.4}, {x: 0, z: 0}, toWear)
        this.NPCs.push(npc);
        this.createNameDisplay(1.3, makeRandNum(), 'reception', npc.body, 50)

        npcInfos.forEach(npz => this.createNpc(theCharacterRoot, npz, true, btf))

        const theDesk = await this.importMesh(scene, "./models/", "guildDesk.glb")
        theDesk.meshes.forEach(mesh => {
            mesh.receiveShadows = true
        });
        theDesk.meshes[0].position.z = 5.5; theDesk.meshes[1].rotation = new Vector3(0,Math.PI,0)
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

        this.createAdventurerBoard(bulletinBoard.meshes[1], {x:-6.3, y:.8, z:2.01}, Math.PI/2)
        this.createTextMesh(makeRandNum(), 'Top Adventurers Board', 'white', {x:-6, y: 2.5, z:2} , 40, scene, false, false)

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
        await this.updatePlace('guildhouse')

        this.createBlock(1,180,{x: 0, z: -2.9}, 0, scene);
        this.createBlock(1,180,{x: 0, z: 8.85}, 0, scene);
        this.createBlock(1,190,{x: -7, z: 4}, Math.PI/2, scene);
        this.createBlock(1,190,{x: 7.2, z: 4}, Math.PI/2, scene);

        const toRender = () => {
            this.actionAndMovement(this.btf, this.cam)
            this.renderMonsters()
        }
        scene.registerBeforeRender(toRender);

        const pathToOutside = this.createPath(1,{x: -1.4, z: -2.6}, scene)
        this.toRegAction(pathToOutside, this.myChar.bx, async () => {
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
        scene.defaultMaterial.backFaceCulling = false;
        Sword.meshes.forEach(mesh => mesh.isVisible = false)
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
                log(hous)
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
        if(isLoading || !goblinRoot || !minotaurRoot) return log('still loading or undefined')
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
               this.craftBonFire(mon.pos, this._scene);
               bonFirezz.push(mon)
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
    checkTreasurez(){
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
            this.checkFlowers()
            this.checkMonsterz()
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
        // this.placeSword(`sample`, {x: -30, y: .9, z: -50}, swordz[1], .23, scene, {name: 'test'})
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

        this.socket.on("monsterGotHit", data => {
            const theMons = Monsterz.find(mons => mons.monsId === data.monsId)
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
            this.monsterIsHit(data.monsId, {x: data.mypos.x, z: data.mypos.z}, data.dmgTaken, data.pos, data.mode, data.isCritical)
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
            const theMons = Monsterz.find(mons => mons.monsId === data.monsId)
            if(!theMons) return log("cannot attack undefined monster from TCP server")
            theMons.isChasing = false
            theMons.isAttacking = true
            log('monster attacked from tcp server ', data)
            const theTargeIsHere = this._scene.getMeshByName(`box.${theMons.targHero}`)
            if(!theTargeIsHere){
                theMons.isChasing = false
                theMons.isAttacking = false
                theMons.targHero = undefined
                log("targ not here")
            }else{
                this.monsterAttack(theMons.monsId, theMons.monsName, data.pos, theMons.targHero, data.animaName)
            }
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
                this.animStopAll(thePlayer)
                thePlayer.mode = "none"
                this.playAnim(thePlayer.anims, "death", true)
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
            const theSword = this._scene.getMeshByName(`sword.${data.meshId}`)
            if(theSword) theSword.dispose()
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
                        playerDet.myshieldz.forEach(mesh => mesh.position.x = -1)                         
                    break;
                    case "fist":
                        log(playerDet.spd)                         
                        playerDet.bx.locallyTranslate(new Vector3(0,0,playerDet.spd * (this._engine.getDeltaTime()/1000) ))
                        playerDet.moveActionName = `running.${playerDet.mode}` 
                        playerDet.myshieldz.forEach(mesh => mesh.position.x = -1)                        
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
                weapnz.mesh.locallyTranslate(new Vector3(0,0,25*(this._engine.getDeltaTime()/1000)))
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
                         if(!myCharDet.runningS.isPlaying) myCharDet.runningS.play()
                    break;
                    case "fist":
                        myCharDet.runningS.setPlaybackRate(1.2)
                        if(this.currentPlace === "guildhouse" || this.currentPlace.includes("apartment")) myCharDet.runningS.setPlaybackRate(1)
            
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
            }
            const btfPos = this.btf.position
            me.dirTarg = {x: btfPos.x,z: btfPos.z}
        })

        document.addEventListener("keyup", e => {

            if(!this._canpress || !canPress || this.det.hp <=0) return log("you are dead or canPress false")
            const keyPressed = e.key.toLowerCase()

            if(keyPressed === "p"){
                log({x:this.myChar.bx.position.x,z:this.myChar.bx.position.z})
                // this.obtain("hukla", "x2", false)
                // this.checkAll()
                // log(this.det)
                this.det.coins+= 400
                this.det.lvl++
                // this.det.stats.spd+=.5
                const meSelf = players.find(pl => pl._id ===this.det._id)
                if(meSelf){
                    meSelf.spd += 1
                    log(meSelf.spd)
                    
                    this._statPopUp("+spd +coins +lvl", 100);
                }
            } 
            if(keyPressed === " "){
                log({x:this.myChar.bx.position.x,z:this.myChar.bx.position.z})
            } 
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
            if(keyPressed === "m") log(Monsterz)
            if(keyPressed === "q") this.myChar.bx.locallyTranslate(new Vector3(0,0,2))
            clearTimeout(this.savingTimeout)
            
            switch(keyPressed){
                case "w":
                    moveNums.straight = 0
                    // this.stopMoving()
                    if(moveNums.leftRight === 0) {this.stopMoving()}else{
                        resetBtfLookAndPos()
                        this.btf.locallyTranslate(new Vector3(moveNums.leftRight * btfRadius,0,moveNums.straight * btfRadius))
                        this.socketAvailable && this.socket.emit("redirectTarg", {_id: this.det._id, dirTarg: { x: this.btf.position.x, z: this.btf.position.z}})
                    }
                break
                case "a":
                    moveNums.leftRight = 0
                    // this.stopMoving()
                    if(moveNums.straight === 0) {this.stopMoving()}else{
                        resetBtfLookAndPos()
                        this.btf.locallyTranslate(new Vector3(moveNums.leftRight * btfRadius,0,moveNums.straight * btfRadius))
                        this.socketAvailable && this.socket.emit("redirectTarg", {_id: this.det._id, dirTarg: { x: this.btf.position.x, z: this.btf.position.z}})
                    }
                break;
                case "d":
                    moveNums.leftRight = 0
                    // this.stopMoving()
                    if(moveNums.straight === 0) {this.stopMoving()}else{
                        resetBtfLookAndPos()
                        this.btf.locallyTranslate(new Vector3(moveNums.leftRight * btfRadius,0,moveNums.straight * btfRadius))
                        this.socketAvailable && this.socket.emit("redirectTarg", {_id: this.det._id, dirTarg: { x: this.btf.position.x, z: this.btf.position.z}})
                    }
                break;
                case "s":
                    moveNums.straight = 0   
                    // this.stopMoving()
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
        swordz.forEach(sword => sword.isVisible = false)
    }
    freeze(mesh){
        mesh.material.freeze()
        mesh.freezeWorldMatrix()
    }
    // CREATIONS
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
            this.createRoadPlank({x: -4.2, z: plankzqnty+Math.random()*1}, Math.PI/2 - Math.random()*.5 + Math.random()*.7)
            this.createRoadPlank({x: 4.2, z: plankzqnty+Math.random()*1}, Math.PI/2 - Math.random()*.5 + Math.random()*.7)
        }
        // half way to guild
        for(var plankzqnty = 15;plankzqnty < 50; plankzqnty+=2){
            this.createRoadPlank({x: -4, z: plankzqnty+Math.random()*1}, Math.PI/2 - Math.random()*.5 + Math.random()*.7)
            this.createRoadPlank({x: 4, z: plankzqnty+Math.random()*1}, Math.PI/2 - Math.random()*.5 + Math.random()*.7)
        } 

        // half way to side left
        for(var plankzqnty = -5;plankzqnty >= -52; plankzqnty-=2){
            this.createRoadPlank({x: plankzqnty-Math.random()*1, z: -20}, -1 + Math.random()*1)
            this.createRoadPlank({x: plankzqnty-Math.random()*1, z: -7.5}, -1 + Math.random()*1)

            // near the entrace
            this.createRoadPlank({x: plankzqnty-Math.random()*1, z: -58}, -1 + Math.random()*1)
        } 
        // half way to side left
        for(var plankzqnty = 5;plankzqnty <= 52; plankzqnty+=2){
            this.createRoadPlank({x: plankzqnty-Math.random()*1, z: -20}, -1 + Math.random()*1)
            this.createRoadPlank({x: plankzqnty-Math.random()*1, z: -7.5}, -1 + Math.random()*1)

            this.createRoadPlank({x: plankzqnty-Math.random()*1, z: -58}, -1 + Math.random()*1)
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
    createSmoke(scene){
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

        return particleSystem
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
        myParticleSystem.disposeOnStop = willDisposeOnStop
        myParticleSystem.targetStopDuration = targStop
        myParticleSystem.updateSpeed = 0.05;
        myParticleSystem.minSize = 0.2;
        myParticleSystem.maxSize = 0.9;
        myParticleSystem.gravity = new BABYLON.Vector3(0, -.5, 0);
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
    createWall(theHeight, theWidth, pos, uAndVscale, modeltex, rotatY, scene){
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
    }
    craftBonFire(loc, scene){
        if(!bonFireMesh) return
        const fireSound = this._allSounds.bonfireSound.clone(`bonfireSound.${makeRandNum()}`)
        const stoneAndStick = bonFireMesh.clone("bonfire");
        stoneAndStick.parent = null
        fireSound.attachToMesh(stoneAndStick)
        const fireClone = fire.clone("fireclone")
        const smokeClone = smoke.clone("smokeClone")
        
        stoneAndStick.position = new Vector3(loc.x,0,loc.z)
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
        this.createDig(loc)
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
    createNpc(theCharacterRoot, det, castShadow, npcCol){
        if(det.place !== this.currentPlace) return log(`npc ${det.name} not from here`)

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
    putFakeShadow(meshBody, sizeShadow, posY){
        const newFakeShadow = fakeShadow.createInstance("fakeShadow")
        newFakeShadow.parent = null
        newFakeShadow.rotationQuaternion = null;
        newFakeShadow.parent = meshBody
        newFakeShadow.position = new Vector3(0,-this.yPos+.03,0)
        if(posY) newFakeShadow.position = new Vector3(0,posY,0)
        if(sizeShadow) {
            newFakeShadow.scaling = new Vector3(sizeShadow,.1,sizeShadow)
        }
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
        detector.parent = body

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
            const {smallCongratsS,brokenS, notifS,changeModeS,skillAcquiredS,consumeS,itemEquipedS, coinReceivedS, nextBtnS, congratsS} = this._allSounds
            
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
        const soundColl = MeshBuilder.CreateBox(`soundColl.${det._id}`, {height: 6, size: .3}, scene)
        soundColl.parent = rootSword; soundColl.position = new Vector3(0,4.5,0)
        soundColl.addRotation(0,0,0);
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

        runningS.attachToMesh(body)
        punchedS.attachToMesh(body)
        sliceHitS.attachToMesh(body)
        whoopS.attachToMesh(rootSword)
        drawSwordS.attachToMesh(rootSword)
        minningS.attachToMesh(rootSword)
        woodCuttingS.attachToMesh(rootSword)
        spearStruck.attachToMesh(body)
        log(this.currentPlace)
        if(this.currentPlace === "guildhouse" || this.currentPlace.includes('apartment')){
            runningS = this._allSounds.woodFloorS.clone()
            runningS.attachToMesh(body)
        }
        meshes.forEach(mesh => {
            if(mesh.name.includes("body") && castShadow) shadowGen.addShadowCaster(mesh)
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

        detector.actionManager = new ActionManager(scene)
        body.actionManager = new ActionManager(scene)

        const createSword = (swordName) => {
            allswords.forEach(sword => {
                if(sword.name.split(".")[1] === swordName){
                    log("we will create this sword")
                    const swordCloned = sword.clone(sword.name)
                    const isAlreadyHave = myswordz.some(swrd => swrd.name === swordName)
                    if(isAlreadyHave) return log("already have this mesh created in my swords meshes")
                    swordCloned.parent = rootSword
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
        if(det.weapon.name !== 'none'){
            myswordz.forEach(swordmesh =>{
                log(swordmesh.name)
                if(swordmesh.name.split(".")[1] === det.weapon.name){
                    swordmesh.isVisible = true
                }else{
                    swordmesh.isVisible = false
                }
            })
        }else{
            myswordz.forEach(swordmesh =>swordmesh.isVisible = false)
        }
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
            detector,
            _moving: false,
            _attacking: false,
            _minning: det._minning ? det._minning : false,
            _training: det._training ? det._training : false,
            _crafting: det._crafting ? det._crafting : false,
            mode: det.mode === undefined ? 'stand' : det.mode,
            status: [], // bashed(will be moved backwards)
            moveActionName: "none",
            spd: det.stats.spd,
            dirTarg: {x: 0, z: -1},
            anims: entries.animationGroups,
            meshes,
            soundColl,
            myhelmetz,
            myshieldz,
            swordz: myswordz, rHand, lHand, rootBone, rootSword, rHead, theHair,
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
            diedS
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
    async createGround(scene, directory, size){
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
    async importMesh(scene, directory, meshName){
        loadingWhat = `creating ${meshName.split(".")[0]} ..`
        const Model = await SceneLoader.ImportMeshAsync("", directory, meshName, scene)
        loadedMesh += 10
        return Model
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
                    this.myChar.minningS.setPlaybackRate(1+Math.random()*.3)
                    this.myChar.woodCuttingS.play()
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
        log(sword.getChildren())
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
        if(isGlowing){
            const newMesh = MeshBuilder.CreateBox("forGlowingSword", {size: 1}, scene)
            newMesh.actionManager = new ActionManager(scene)
            newMesh.parent = mesh
            newMesh.position.y+=1
            newMesh.isVisible = false
            newMesh.actionManager.registerAction(new ExecuteCodeAction(
                {
                    trigger: ActionManager.OnIntersectionEnterTrigger,
                    parameter: this.myChar.detector
                }, e => {            
                    this.openPopUpAction("pickup")
                    this.targetRecource = mesh
                    this.targDetail = swordDet
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
        }else{
            mesh.actionManager.registerAction(new ExecuteCodeAction(
                {
                    trigger: ActionManager.OnIntersectionEnterTrigger,
                    parameter: this.myChar.detector
                }, e => {            
                    this.openPopUpAction("pickup")
                    this.targetRecource = mesh
                    this.targDetail = swordDet
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

        this.lootz.push({...swordDet, body: mesh})
        mesh.freezeWorldMatrix()
        mesh.material.freeze()
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
                    this._allSounds.creepyAmbS.attachToMesh(this.myChar.bx)
                    this._allSounds.celesMelody.attachToMesh(this.myChar.bx)

                    if(Math.random() > .5){
                        this._allSounds.creepyAmbS.play()
                    }else{
                        this._allSounds.celesMelody.play()
                    }
                }
                mons.forEach(mon => {
                    if(mon.monsName === monsName){
                        mon.targHero = this.det._id
                        mon.isChasing = true
                    }
                })
            }
        ))
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
    createNewCircle(kolur, rotat, pos, playerId, scalingDura){
        let timeOutForMagicCirc
        const newCircle = magicCircle.clone(`circle.${playerId}.${makeRandNum()}`)
        newCircle.position = new Vector3(pos.x,pos.y, pos.z)
        newCircle.visibility = .15
        const glowMat = new StandardMaterial("glowCircle", scene);
        glowMat.emissiveColor = new Color3(kolur.r,kolur.g,kolur.b);
        newCircle.rotation = new Vector3(0, 0, 0)
        newCircle.addRotation(rotat.x, rotat.y, rotat.z)
        newCircle.isVisible = true
        newCircle.material = glowMat
        newCircle.scaling = new Vector3(0,.02,0);
        this.allScaling.push({mesh: newCircle, spd: .03})
        this.allRotating.push({mesh: newCircle, spd: .009})

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
    createFlyingWeapon(mypos, weapDmg, myMode, weaponMesh, pos, dirTarg, weaponDetail, ownerId){
        const weapMesh = MeshBuilder.CreateBox("sword.flying", { size: .3}, this._scene) // size : .3
        weapMesh.position = new Vector3(pos.x,1.4,pos.z)
        weapMesh.isVisible = false
        log(dirTarg)
        this.playerLookAt(weapMesh, dirTarg)
        weapMesh.locallyTranslate(new Vector3(.1,0,-.5))
        weapMesh.actionManager = new ActionManager(this._scene)
        const weapId = makeRandNum()
        const clonedWeapon = weaponMesh.clone("cloned")
        clonedWeapon.rotationQuaternion = null
        clonedWeapon.parent = weapMesh
        clonedWeapon.scaling = new Vector3(.2,.19,.2)
        clonedWeapon.addRotation(Math.PI/2,0,0)
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
                
                if(!this.socketAvailable){
                    this.monsterIsHit(mons.monsId, mypos, weapDmg, mons.body.getAbsolutePosition(), "throw", true)
                }else{
                    const mpos = mons.body.getAbsolutePosition()
                    // babawasan niya yung buhay ng monster
                    this.socket.emit("monsterIsHit", {monsId: mons.monsId, dmgTaken: weapDmg, 
                    _id: ownerId,
                    pos: {x: mpos.x, z: mpos.z}, mypos: {x: mypos.x, z: mypos.z}, mode: "throw", isCritical: true})
                }
                
                
                log(mons.monsName + "is Hit")
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
                }
                weapMesh.lookAt(new Vector3(mypos.x, .5, mypos.z),0,0,0,BABYLON.Space.WORLD)
                weapMesh.addRotation(Math.PI,0,0);
                log(this.flyingWeaponz.length)
            })
        })
        const woodImpS = this._allSounds.woodCuttingS.clone()
        woodImpS.attachToMesh(weapMesh)
        woodImpS.stop()
        weapMesh.addRotation(.05,0,0)
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
            })
        }
        this._scene.meshes.forEach(mesh => {
            if(mesh.name.includes("wood")){
                this.toRegAction(weapMesh, mesh, () => {
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
        })
        log(this._scene.getMeshByName("ground"))
        this.flyingWeaponz.push({mesh: weapMesh, meshId: weapId})
        setTimeout(() => {
            woodImpS.dispose()
        }, 2500)
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

        const scaleR = .3 * Math.random()
        const randomSec = 3000 + (5000 * Math.random())
        
        const body = MeshBuilder.CreateBox(`goblin.${monsId}`, {size: monsName === "minotaur" ? 1 : .4, height: 2}, this.scene)
        body.position = new Vector3(pos.x,1,pos.z);
        body.isVisible = true;
        body.rotation.y = Math.random() * 4
        body.visibility = .9

        let punchedS
        switch(monsName){
            case "golem":
                punchedS = this._allSounds.rockSmashS.clone()
            break;
            default:
                punchedS = this._allSounds.punched.clone()
            break
        }
        const sliceFleshS = this._allSounds.sliceFlesh.clone()
        const sliceHitS = this._allSounds.sliceHit.clone();
        const spearStruck = this._allSounds.spearStruckS.clone();

        let monsSoundDied = undefined

        punchedS.attachToMesh(body)
        sliceHitS.attachToMesh(body)
        sliceFleshS.attachToMesh(body)
        spearStruck.attachToMesh(body)
        sliceFleshS.setPlaybackRate(1.2)
    
        const enemyDetection = MeshBuilder.CreateBox(`enemyDetection.${monsId}`, {size: 6, height: .6}, scene)
        enemyDetection.parent = body
        enemyDetection.isVisible = false

        let atkDetDepth = monsName === "minotaur" ? 1.9 : .8
        const atkDetection = MeshBuilder.CreateBox(`atkDetection.${monsId}`, {depth: atkDetDepth , height: .6, width: .5}, scene)
        atkDetection.parent = body
        atkDetection.position.z += .4
        atkDetection.isVisible = false

        const weapon = MeshBuilder.CreateBox(`weapon.${monsId}`, {depth: .8, height: .6, width: .5}, scene)
        weapon.parent = body
        weapon.position.z += monsName === "minotaur" ? 1 : .5

        let entries = monsRoot.instantiateModelsToScene();
        entries.animationGroups.forEach(ani => ani.name = ani.name.split(" ")[2])
        
        let rBone = undefined
        let rMeshSize = {size: 2, height: 7}
        switch(monsName){
            case "goblin":
                rMeshSize = {size: 2, height: 8}
                this.putFakeShadow(body, 2)
            break
            case "viper":
                rMeshSize = {size: .5, height: 3}
            break
            case "minotaur":
                log("minaaa")
                rMeshSize = {size: .6, height: 2}
                this.putFakeShadow(body, 4)
            break
            case "eater":
                log("is eater")
                rMeshSize = {size: 1, height: 1}
                this.putFakeShadow(body, 4)
            break
            case "golem":
                rMeshSize = {size: .7, height: 1.4}
                this.putFakeShadow(body, 7)
            break
        }
        const meshes = entries.rootNodes
        entries.rootNodes[0].getChildren().forEach(mes => {
            mes.name = mes.name.split(" ")[2]
            // if(mes.name.includes("body") && castShadow) shadowGen.getShadowMap().renderList.push(mes)
            if(mes.name.includes("armor")){
                if(mes.name.includes(armorName)){
                    mes.isVisible = true
                }else mes.dispose()
            }
            if(mes.name === "Armature"){
                mes.getChildren().forEach(arm => {
                    if(arm.name.includes("rootBone")) {
                        // log(`${monsName} have rootBone`)
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
        let monsSoundHit = undefined
        let namePosY = 1.3
        let healthPosY = 1
        switch(monsName){
            case "minotaur":
                namePosY = 1.8
                healthPosY = 1.5
                monsSoundHit = this._allSounds.minotaurS.clone(`hitSound.${monsName}`)
            break;
            case "viper":
                namePosY = 2
                healthPosY = 1.9
            break;
            case "goblin":
                monsSoundHit = this._allSounds.goblinHitS.clone(`hitSound.${monsName}`)
            break
            case "golem":
                namePosY = 3.1
                healthPosY = 3
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
                
                const isMyTargetHere = this._scene.getMeshByName(`box.${theMons.targHero}`)
                if(!isMyTargetHere){
                    log("target is no longer here time to change")
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
                    return
                }
                if(isMyTargetHere) return log("the target is here return")
                if(this.det.hp <= 0) return log("this player is dead")
                log(theMons.targHero);
                if(this.socketAvailable){
                    log("is online will chase")
                    this.socket.emit("monsWillChase", {monsId, targHero: this.det._id})
                }else{
                    theMons.isAttacking = false
                    theMons.targHero = this.det._id
                    theMons.isChasing = true
                }
                
            }
        ))
        enemyDetection.actionManager.registerAction(new ExecuteCodeAction(
            {
                trigger: ActionManager.OnIntersectionExitTrigger,
                parameter: this.myChar.bx
            }, e => {
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
                    if(this.socketAvailable){
                        this.socket.emit("monsWillChase", {monsId, targHero: this.det._id})
                    }else{
                        theMons.isAttacking = false
                        theMons.targHero = this.det._id
                        theMons.isChasing = true
                    }
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
                const theIdOfPlayer = this.myChar.bx.name.split(".")[1]
                punchedS.setPlaybackRate(1+Math.random()*.2)
                punchedS.play()
                this.socketAvailable && this.socket.emit("playerIsHit", {_id: theIdOfPlayer, monsId, animName: 'hitcenter',dmg})

                this.hitByNonMultiAI(this.myChar.bx, body, dmg, 'hitcenter', monsId, effects ? effects : false)
            }
        ))
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
            sliceFleshS,
            sliceHitS,
            monsSoundDied,
            monsBreed
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
        continueBtn.style.display = "block"
        loginPage.style.display = "none"

    }else{
        log("walang record")
        continueBtn.style.display = "none"
        loginPage.style.display = "flex"
        homeInputs.forEach(inp => inp.value = '')
        registerBtn.style.display = "none"
        loginBtn.style.display = "block"
        allRegClass.forEach(elemnt => elemnt.style.display = "none")
    }
}
function checkScreen(){
    if(window.innerWidth < mobileMaxWidth) return warningCont.style.display = "flex"
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
        if(classN === undefined) return
        loginPage.style.display = "flex"
        log(classN)
        
        switch(classN){
            case "gotoreg":
            homeInputs.forEach(inp => inp.value = '')
            loginBtn.style.display = "none"
            registerBtn.style.display = "block"
            allRegClass.forEach(elemnt => elemnt.style.display = "block")
            log(classN)
            myGameLogo.classList.add("db-placeup")
            break;
            case "gotologin":
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
