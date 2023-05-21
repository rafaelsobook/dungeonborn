

const log = console.log
const normalNpc = async (scene, BABYLON, pos, dirTarg, suit) => {

    const {Vector3, SceneLoader,MeshBuilder} = BABYLON
    
    const npcId = Math.random().toString().split(".")[1]
    const body = MeshBuilder.CreateBox(`npc.${npcId}`, {size: .3, height: 1.7}, scene)
    body.position = new Vector3(pos.x,.82,pos.z);
    body.isVisible = false

    const Npc = await SceneLoader.ImportMeshAsync("", "./models/", "gameCharac.glb", scene)
    
    Npc.meshes[0].rotationQuaternion = null
    Npc.meshes[0].parent = body
    Npc.meshes[0].position = new Vector3(0,-.83,0)

    Npc.meshes.forEach(mesh => {
        if(mesh.name.includes("root") || mesh.name.includes(suit.hair) ||
        mesh.name.includes(suit.cloth) || mesh.name.includes(suit.pants) ||
        mesh.name.includes("body") || mesh.name.includes(suit.boots)){
            mesh.isVisible = true
        }else{
            mesh.dispose()
        }
    });

    let rHand
    let rootBone
    Npc.meshes.forEach(mesh => {
        if(mesh.name.includes("_root_")){
            mesh.getChildren()[0].getChildren().forEach(mesh => {
                if(mesh.name === "rbone"){
                    rootBone = mesh.getChildren()[0] // sumunod ng root bone spine
                    rHand = mesh.getChildren()[0].getChildren()[0].getChildren()[2].getChildren()[0].getChildren()[0].getChildren()[0]
                }
            })
        }
    })
    const {x,z} = dirTarg

    body.lookAt(new Vector3(x,body.position.y,z),0,0,0)

    return {
        _id: npcId,
        body,
        spd: .04,
        anims: Npc.animationGroups,
        dirTarg: {x, z},
        isRunning: false,
        isWalking: false,
        rHand,
        rootBone
    }
}


export default normalNpc