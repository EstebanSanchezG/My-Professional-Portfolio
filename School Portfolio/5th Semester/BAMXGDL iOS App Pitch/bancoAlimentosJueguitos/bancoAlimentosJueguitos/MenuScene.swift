//
//  MenuScene.swift
//  bancoAlimentosJueguitos
//
//  Created by user195798 on 10/4/21.
//

import SpriteKit

class MenuScene: SKScene {
    let VerdePrimario = UIColor(red: 54/255.0, green: 148/255.0, blue: 67/255.0, alpha: 1.00)
    let VerdeSecundario = UIColor(red: 54/255.0, green: 148/255.0, blue: 67/255.0, alpha: 0.50)
    let RojoPrimario = UIColor(red: 117/255.0, green: 18/255.0, blue: 47/255.0, alpha: 1.00)
    let RojoSecundario = UIColor(red: 117/255.0, green: 18/255.0, blue: 47/255.0, alpha: 0.50)
    let AmarilloPrimario = UIColor(red: 227/255.0, green: 166/255.0, blue: 17/255.0, alpha: 1.00)
    let AmarilloSecundario = UIColor(red: 227/255.0, green: 166/255.0, blue: 17/255.0, alpha: 0.50)
    
    override func didMove(to view: SKView) {

        let bg = SKSpriteNode(imageNamed: "MenuBackground")
        bg.name = "Background"
        bg.blendMode = .replace
        bg.zPosition = -1
        bg.position = CGPoint(x: 0, y: 0)
        bg.size = CGSize(width: frame.size.width, height: frame.size.height)
        bg.position = CGPoint(x: frame.midX, y: frame.midY)
        addChild(bg)
        physicsWorld.gravity = .zero
        
        let truck = SKSpriteNode(imageNamed: "truck")
        truck.name = "Truck"
        truck.size = CGSize(width: 0.5 * truck.size.width, height: 0.5 * truck.size.height)
        truck.position = CGPoint(x: frame.minX + truck.size.width/2 + 30, y: frame.minY + truck.size.height/2 - 30)
        addChild(truck)
        
        let lb = SKSpriteNode(imageNamed: "leaderboard")
        lb.name = "Leaderboard"
        lb.size = CGSize(width: 0.08 * lb.size.width, height: 0.08 * lb.size.height)
        lb.position = CGPoint(x: frame.maxX - 150, y: frame.minY + 120)
        addChild(lb)
        
        let playButton = SKLabelNode()//(imageNamed: "NextButtonIcon")
        playButton.name = "Play"
        playButton.text = "Jugar"
        playButton.fontName = "ArialRoundedMTBold"
        playButton.fontSize = 32
        playButton.fontColor = .black
        //play.size = CGSize(width: 0.03 * play.size.width, height: 0.03 * play.size.height)
        playButton.position = CGPoint(x: frame.maxX - 200, y: frame.maxY - 150)
        let playFrame = SKShapeNode()
        playFrame.name = "Play"
        playFrame.path = UIBezierPath(roundedRect: CGRect(x: 0, y: 0, width: playButton.frame.width + 60, height: playButton.frame.height + 60), cornerRadius: 30).cgPath
        playFrame.position = CGPoint(x: playButton.position.x - playFrame.frame.width/2, y: playButton.position.y - 32)
        playFrame.fillColor = AmarilloPrimario
        playFrame.strokeColor = AmarilloSecundario
        playFrame.lineWidth = 3
        addChild(playFrame)
        addChild(playButton)
        
        let donarButton = SKLabelNode()//boton que manda a la pagina del banco
        //donarButton.name = "Donar"
        donarButton.text = "Apoya"
        donarButton.fontName = "ArialRoundedMTBold"
        donarButton.fontSize = 20
        donarButton.fontColor = .black
        //play.size = CGSize(width: 0.03 * play.size.width, height: 0.03 * play.size.height)
        donarButton.position = CGPoint(x: frame.maxX - 230, y: frame.minY + 110)
        let donarFrame = SKShapeNode()
        donarFrame.name = "Donar"
        donarFrame.zPosition = 5
        donarFrame.path = UIBezierPath(roundedRect: CGRect(x: 0, y: 0, width: donarButton.frame.width + 45, height: donarButton.frame.height + 20), cornerRadius: 30).cgPath
        donarFrame.position = CGPoint(x: donarButton.position.x - donarFrame.frame.width * 0.6, y: donarButton.position.y - 13)
//        donarFrame.fillColor = RojoPrimario
//        donarFrame.strokeColor = RojoSecundario
        donarFrame.lineWidth = 0
        addChild(donarFrame)
        addChild(donarButton)
        
        let DonarIcon = SKSpriteNode(imageNamed: "BAMXIcon2")
        //DonarIcon.name = "Donar"
        DonarIcon.size = CGSize(width: 0.08 * DonarIcon.size.width, height: 0.08 * DonarIcon.size.height)
        DonarIcon.position = CGPoint(x: donarButton.position.x - 50, y: donarButton.position.y  + 10)
        addChild(DonarIcon)
        
    }
    
    override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
        let touch = touches.first
        if let location = touch?.location(in: self){
            let nodesArray = self.nodes(at: location)
            print(nodesArray)
            if(nodesArray.first?.name == "Play"){
                print("AJUEGAR")
                let transition = SKTransition.fade(withDuration: 0.5)
                let nextScene = GameScene(size: self.size)
                self.view?.presentScene(nextScene, transition: transition)
            }
            if(nodesArray.first?.name == "Donar"){
                print("donastimes")
                UIApplication.shared.openURL(URL(string: "https://bdalimentos.org/")!)
            }
            if(nodesArray.first?.name == "Leaderboard"){
                print("aver")
                let transition = SKTransition.fade(withDuration: 0.5)
                let nextScene = LeaderboardScene(size: self.size)
                self.view?.presentScene(nextScene, transition: transition)
            }
        }
    }
}

