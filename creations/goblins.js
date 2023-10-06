import * as GUI from 'babylonjs-gui';
const log = console.log
class Goblin{
    constructor(pos, directory, modelName, gobType, isMulti, monsLvl, BABYLON, hp, spd, scene){
        this.pos = pos
        this.directory = directory
        this.modelName = modelName
        this.isMulti = isMulti
        this.BABYLON = BABYLON
        this.scene = scene
        this.gobType = gobType
        this.monsLvl = monsLvl
        this.hp = hp
        this.spd = spd

        // FOR GOBLIN
        this.anims
        this.registeredCharacters = []
        this.body
        this.enemyDetection
        this.atkDetection
        this.weapon
        this.target

        this.attackInterval

        this.chasing = false
    }
    createNameDisplay(posY, theId, labelName, parentMesh){
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
    }

    async initCreation(){
        const {Vector3, Mesh, SceneLoader,MeshBuilder, ActionManager, ExecuteCodeAction} = this.BABYLON
    
        const monsId = Math.random().toString().split(".")[1]
        
        const body = MeshBuilder.CreateBox(`goblin.${monsId}`, {size: .3, height: 2}, this.scene)
        body.position = new Vector3(this.pos.x,1,this.pos.z);
        body.isVisible = false
    
        const enemyDetection = MeshBuilder.CreateBox(`enemyDetection.${monsId}`, {size: 6, height: .6}, this.scene)
        enemyDetection.parent = body
        enemyDetection.isVisible = false

        const atkDetection = MeshBuilder.CreateBox(`atkDetection.${monsId}`, {depth: .8, height: .6, width: .5}, this.scene)
        atkDetection.parent = body
        atkDetection.position.z += .4
        atkDetection.isVisible = false

        const weapon = MeshBuilder.CreateBox(`weapon.${monsId}`, {depth: .8, height: .6, width: .5}, this.scene)
        weapon.parent = body
        weapon.position.z += .5
        // weapon.isVisible = false
    
        const Monster = await SceneLoader.ImportMeshAsync("", this.directory, `${this.modelName}${this.gobType}.glb`, this.scene)
        
        Monster.meshes[0].rotationQuaternion = null
        Monster.meshes[0].parent = body
        Monster.meshes[0].position = new Vector3(0,-1,0)
        
        this.anims = Monster.animationGroups

        // ACTION MANAGERS
        body.actionManager = new ActionManager(this.scene)
        enemyDetection.actionManager = new ActionManager(this.scene)
        atkDetection.actionManager = new ActionManager(this.scene)
        weapon.actionManager = new ActionManager(this.scene)

        this.body = body
        this.enemyDetection = enemyDetection
        this.atkDetection = atkDetection
        this.weapon = weapon
        
        this.scene.registerBeforeRender(() => {
            if(this.chasing){
                const {x,z} = this.target.position
                this.body.lookAt(new Vector3(x, this.body.position.y,z),0,0,0)
                this.body.locallyTranslate(new Vector3(0,0,.04))
                this.anims.forEach(anim => anim.name === "running" && anim.play())
            }
            weapon.position.y += 0.06
        })

        this.createNameDisplay(1, monsId, this.modelName, body)
        const robHealthTextGui = this.createHealthBar(.7, monsId, body)
        

        return {
            monsId,
            target: null,
            body,
            enemyDetection,
            atkDetection,
            weapon,
            robHealthTextGui,
            hp: this.hp,
            maxHp: this.hp,
            anims: Monster.animationGroups, 
            isChasing: true, 
            isAttacking: false, 
            spd: this.spd,
        }
    }
    goblinDied(){
        this.anims.forEach(anim => {
            if(anim.name === "death"){
                anim.play()
            }else{
                anim.stop()
            }
        })
    }
    regCharacMesh(characMeshes){
        const {Vector3, SceneLoader,MeshBuilder, ActionManager, ExecuteCodeAction} = this.BABYLON
        characMeshes.forEach(charac => {
            const isAlreadyReg = this.registeredCharacters.some(chars => chars.charId === charac.charId)
            if(isAlreadyReg) return log("already registered")
            this.enemyDetection.actionManager.registerAction(new ExecuteCodeAction(
                {
                    trigger: ActionManager.OnIntersectionEnterTrigger,
                    parameter: charac.bx
                }, e => {
                    this.target = charac.bx
                    this.chasing = true
                    log(charac.bx)
                }
            ))
            this.enemyDetection.actionManager.registerAction(new ExecuteCodeAction(
                {
                    trigger: ActionManager.OnIntersectionExitTrigger,
                    parameter: charac.bx
                }, e => {
                    log(this.anims)
                    this.chasing = false
                    this.anims.forEach(anim => anim.name === "running" && anim.stop())
                }
            ))
            // ATTACK DETECTOR
            this.atkDetection.actionManager.registerAction(new ExecuteCodeAction(
                {
                    trigger: ActionManager.OnIntersectionEnterTrigger,
                    parameter: charac.bx
                }, e => {
                    let numAttack = Math.floor(Math.random() * 3)
                    numAttack = numAttack === 0 ? 1 : numAttack
                    log(numAttack)
                    this.chasing = false
                    this.attack(charac.bx, `attack${numAttack}`)
                    clearTimeout(this.attackInterval)
                    this.attackInterval = setInterval(() => {
                        this.attack(charac.bx, `attack${numAttack}`)
                    }, 3000)
                }
            ))
            this.atkDetection.actionManager.registerAction(new ExecuteCodeAction(
                {
                    trigger: ActionManager.OnIntersectionExitTrigger,
                    parameter: charac.bx
                }, e => {
                    this.chasing = true
                    clearTimeout(this.attackInterval)
                }
            ))

            // when collided in the weapon
            this.weapon.actionManager.registerAction(new ExecuteCodeAction(
                {
                    trigger: ActionManager.OnIntersectionEnterTrigger,
                    parameter: charac.bx
                }, e => {
                    charac.anims.forEach(anim => anim.name === "hitcenter" && anim.play())
                }
            ))
        })
    }
    attack(body, animName){
        const {Vector3, MeshBuilder, ActionManager, ExecuteCodeAction} = this.BABYLON
        const {x,z} = body.position
        this.body.lookAt(new Vector3(x, this.body.position.y,z),0,0,0)
        this.anims.forEach(anim => anim.name === `${animName}` && anim.play())

        this.weapon.position.y = -3
    }

    // CREATIONS
    async createNameDisplay(posY, theId, labelName, parentMesh){
        const {Vector3, Mesh} = this.BABYLON
        // name display
        const nameMesh = Mesh.CreatePlane(`plane.${theId}`, 3);
        
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
    }
}

const goblin = async (pos, directory, modelName, gobType, isMulti, monsLvl, BABYLON, hp, spd, scene) => {
    
}

export default Goblin