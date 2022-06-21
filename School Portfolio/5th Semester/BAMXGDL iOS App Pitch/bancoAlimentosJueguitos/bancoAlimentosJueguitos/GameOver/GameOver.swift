//
//  GameOver.swift
//  bancoAlimentosJueguitos
//
//  Created by user195798 on 10/19/21.
//
import SpriteKit
import GameplayKit

class GameOver: SKScene {
    
    var message = SKLabelNode()
    var nextMessage = SKSpriteNode()
    var textBox = SKShapeNode()
    
    var Vicente = SKAction.playSoundFileNamed("VicenteTalk.mp3", waitForCompletion: false)
    var thisGame: SavedGame?
    var dialogues: [String] = []
    var dialogueIndex: Int = 0
    
    func loadData(){
        let savedGameURL = Bundle.main.url(forResource: "saved", withExtension: "json")!
        let savedGameData = try? String(contentsOf: savedGameURL)
        let game = Data(savedGameData!.utf8)

        let gameJSON = try! JSONDecoder().decode(SavedGame.self, from: game)
        thisGame = gameJSON
        
        dialogues.append("GAME OVER")
        dialogues.append("Hasta aqui llegamos, tuvimos una gran partida, quiza no lo notaste pero ve esto")
        dialogues.append("Dirigiste el banco de alimentos por \(thisGame!.rounds) semanas")
        dialogues.append("Logramos donar un total de \(thisGame!.donated) alimentos, ayudando en el proceso a \(thisGame!.comunidades) comunidades en el proceso")
        dialogues.append("Pero no todo fue color de rosas, tambien se desperdiciaron \(thisGame!.perecederosThrowaway) alimentos perecederos y \(thisGame!.noPerecederosThrowaway) no perecederos")
        dialogues.append("¡Gracias!")
    }
    override func didMove(to view: SKView) {
        loadData()
        
        let bg = SKSpriteNode(imageNamed: "BGBodega")
        bg.name = "Background"
        bg.blendMode = .replace
        bg.zPosition = -1
        bg.size = CGSize(width: frame.size.width, height: frame.size.height)
        bg.position = CGPoint(x: frame.size.width/2, y: frame.size.height/2)
        addChild(bg)
        physicsWorld.gravity = .zero

        let assistant = SKSpriteNode(imageNamed: "Assistant")
        assistant.name = "Assistant"
        assistant.size = CGSize(width: assistant.size.width * 1.5, height: assistant.size.height * 1.5)
        assistant.position = CGPoint(x: frame.minX + assistant.size.width/2 - 20, y: frame.minY)
        assistant.xScale = -1
        addChild(assistant)
        
        textBox = SKShapeNode()
        textBox.path = UIBezierPath(roundedRect: CGRect(x: 0, y: 0, width: frame.width * 0.8, height: 100), cornerRadius: 15).cgPath
        textBox.position = CGPoint(x: frame.midX - frame.width*0.4, y: frame.minY + 30)
        textBox.fillColor = UIColor.white
        textBox.strokeColor = UIColor.black
        textBox.lineWidth = 1
        textBox.zPosition = 1
        addChild(textBox)

        message = SKLabelNode()
        message.numberOfLines = 2
        message.lineBreakMode = .byWordWrapping
        message.preferredMaxLayoutWidth = textBox.frame.width - 115
        message.horizontalAlignmentMode = .left
        message.verticalAlignmentMode = .center
        message.fontName = "Arial"
        message.fontSize = 25
        message.fontColor = .black
        message.position = CGPoint(x: textBox.frame.minX + 10, y: textBox.frame.midY - message.frame.height)
        message.zPosition = 2
        updateMessage(index: 0)
        addChild(message)
        
        nextMessage = SKSpriteNode(imageNamed: "NextButtonIcon")
        nextMessage.name = "Continue Description"
        nextMessage.size = CGSize(width: nextMessage.size.width * 0.08, height: nextMessage.size.height * 0.08)
        nextMessage.zPosition = 5
        nextMessage.position = CGPoint(x: textBox.frame.maxX - nextMessage.size.width, y: textBox.frame.midY )
        addChild(nextMessage)
    }
    func showMessage(){
        addChild(textBox)
        addChild(message)
        addChild(nextMessage)
    }
    func updateMessage(index: Int){
        run(Vicente)
        if( index == dialogues.count ){
            autoSave()
            let transition = SKTransition.fade(withDuration: 0.5)
            let nextScene = MenuScene(size: self.size)
            self.view?.presentScene(nextScene, transition: transition)
        }
        else{
            message.text = dialogues[dialogueIndex]
        }
    }
    
    override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
        let touch = touches.first
        if let location = touch?.location(in: self){
            let nodesArray = self.nodes(at: location)
            
            if(nodesArray.first?.name == "Continue Description"){
                dialogueIndex += 1
                updateMessage(index: dialogueIndex)
            }
        }
    }
    func autoSave(){
        
        thisGame!.reputation = 50
        thisGame!.noPerecederos = 875
        thisGame!.perecederos = 389
        thisGame!.currency = 5400
        thisGame!.maxNoPerecederos = 1000
        thisGame!.maxPerecederos = 1000
        thisGame!.daysLeft = 4
        thisGame!.recibe = 0.5
        thisGame!.comunidades = 2
        thisGame!.throwaway = 0.05
        thisGame!.perecederosThrowaway = 0
        thisGame!.noPerecederosThrowaway = 0
        thisGame!.donated = 0
        thisGame!.rounds = 1
        
        let savedGameURL = Bundle.main.url(forResource: "saved", withExtension: "json")!
        let gameData = try! JSONEncoder().encode(thisGame)
        let gameString = String(data: gameData, encoding: .utf8)!
        print(gameString)
        try? gameString.write(to: savedGameURL, atomically: false, encoding: .utf8)
    }
}
