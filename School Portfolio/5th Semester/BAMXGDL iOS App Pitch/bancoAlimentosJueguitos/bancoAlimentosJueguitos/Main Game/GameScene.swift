//
//  GameScene.swift
//  bancoAlimentosJueguitos
//
//  Created by Javier Lizarraga on 07/09/21.
//

import SpriteKit
import GameplayKit

struct NestedJSONModel: Codable {
    let situation: [Situations]

    enum CodingKeys: String, CodingKey {
        case situation
    }
}
struct Situations: Codable {
    var dialogo: [String]
    var bg: String?
    var left: Modifier
    var right: Modifier

    enum CodingKeys: String, CodingKey {
        case dialogo
        case bg
        case left
        case right
    }
}
struct Modifier: Codable {
    var desc: String
    var repDiff: Double?
    var npDiff: Int?
    var perDiff: Int?
    var moneyDiff: Int?
    var modifierMaxnp: Int?
    var modifierMaxper: Int?
    var modifierPereTrash: Double?
    var modifierComunidades: Int?
    var modifierPereReceive: Double?

    enum CodingKeys: String, CodingKey {
        case desc
        case repDiff
        case npDiff
        case perDiff
        case moneyDiff
        case modifierMaxnp
        case modifierMaxper
        case modifierPereTrash
        case modifierComunidades
        case modifierPereReceive
    }
}
struct SavedGame: Codable {
    var reputation: Double
    var noPerecederos: Int
    var maxNoPerecederos: Int
    var perecederos: Int
    var maxPerecederos: Int
    var currency: Int
    var daysLeft: Int
    var recibe: Double
    var comunidades: Int
    var throwaway: Double
    var perecederosThrowaway: Int
    var noPerecederosThrowaway: Int
    var donated: Int
    var rounds: Int
}

class GameScene: SKScene {
    let VerdePrimario = UIColor(red: 54/255.0, green: 148/255.0, blue: 67/255.0, alpha: 1.00)
    let VerdeSecundario = UIColor(red: 54/255.0, green: 148/255.0, blue: 67/255.0, alpha: 0.50)
    let RojoPrimario = UIColor(red: 117/255.0, green: 18/255.0, blue: 47/255.0, alpha: 1.00)
    let RojoSecundario = UIColor(red: 117/255.0, green: 18/255.0, blue: 47/255.0, alpha: 0.50)
    let AmarilloPrimario = UIColor(red: 227/255.0, green: 166/255.0, blue: 17/255.0, alpha: 1.00)
    let AmarilloSecundario = UIColor(red: 227/255.0, green: 166/255.0, blue: 17/255.0, alpha: 0.50)

    
    var repIcon = SKSpriteNode()
    var repBaseBar = SKShapeNode()
    var repActualAmount = SKShapeNode()
    var noPerecederoIcon = SKSpriteNode()
    var noPerecederoBar = SKShapeNode()
    var noPerecederoAmount = SKShapeNode()
    var perecederoIcon = SKSpriteNode()
    var perecederoBar = SKShapeNode()
    var perecederoAmount = SKShapeNode()
    var currencyFrame = SKShapeNode()
    var currencyLabel = SKLabelNode()
    
    var message = SKLabelNode()
    var nextMessage = SKSpriteNode()
    var textBox = SKShapeNode()
    
    var Vicente = SKAction.playSoundFileNamed("VicenteTalk.mp3", waitForCompletion: false)
    var situationArray: [Situations]?
    var thisGame: SavedGame?
    var currrentIndex: Int = 0
    var dialogueIndex: Int = 0
    var faltaDonar: Bool = true
    var dontBuy: Bool = true
    
    func loadData(){
        let situationsURL = Bundle.main.url(forResource: "situations", withExtension: "json")!
        let situationsData = try? String(contentsOf: situationsURL)
        let data = Data(situationsData!.utf8)
        let json = try! JSONDecoder().decode(NestedJSONModel.self, from: data)
        situationArray = json.situation
        
        let savedGameURL = Bundle.main.url(forResource: "saved", withExtension: "json")!
        let savedGameData = try? String(contentsOf: savedGameURL)
        let game = Data(savedGameData!.utf8)
        let gameJSON = try! JSONDecoder().decode(SavedGame.self, from: game)
        thisGame = gameJSON
    }
    func GTFO(){
        let gtfo = SKSpriteNode(imageNamed: "escButton")
        gtfo.name = "GTFO"
        gtfo.zPosition = 69
        gtfo.size = repIcon.size
        gtfo.position = CGPoint(x: perecederoIcon.frame.maxX + 150, y: repIcon.position.y)
        addChild(gtfo)
    }
    var bg = SKSpriteNode()
    override func didMove(to view: SKView) {
        loadData()
        currrentIndex = Int.random(in: 0 ..< situationArray!.count-1)

        bg = SKSpriteNode(imageNamed: "BGCarga")
        bg.name = "Background"
        bg.blendMode = .replace
        bg.zPosition = -1
        bg.size = CGSize(width: frame.size.width, height: frame.size.height)
        bg.position = CGPoint(x: frame.size.width/2, y: frame.size.height/2)
        addChild(bg)
        physicsWorld.gravity = .zero

        loadCurrency()
        loadReputation()
        loadNoPerecederos()
        loadPerecederos()
        GTFO()

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
        situationArray![currrentIndex].dialogo.insert("Hemos recibido \(max(3,Int(thisGame!.recibe * thisGame!.reputation / 2))) en alimentos perecedros", at:0)
        situationArray![currrentIndex].dialogo.insert("Estan llegando los donativos de hoy", at: 0)
        thisGame!.perecederos += max(3,Int(thisGame!.recibe * thisGame!.reputation * 0.3))
        updateMessage(index: 0)
        addChild(message)
        updatePerecederos()
        
        //loadButtons(situation: thisSituation)
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
        if( index == 2 && faltaDonar){
            bg.texture = SKTexture(imageNamed: situationArray![currrentIndex].bg!)
        }
        if( index == situationArray![currrentIndex].dialogo.count ){
            if( faltaDonar ){
                message.removeFromParent()
                nextMessage.removeFromParent()
                textBox.removeFromParent()
                loadButtons()
            }else{
                thisGame!.daysLeft -= 1
                if(thisGame!.daysLeft == 0){
                    dontBuy = false
                    thisGame!.daysLeft = Int.random(in: 4 ..< 8)
                    currrentIndex = situationArray!.count - 1
                    dialogueIndex = 0
                    buyCans(index: 0)
                }else{
                    thisGame!.rounds += 1
                    autoSave()
                    let transition = SKTransition.fade(withDuration: 0.5)
                    let nextScene = GameScene(size: self.size)
                    self.view?.presentScene(nextScene, transition: transition)
                }
            }
        }
        else{
            message.text = situationArray![currrentIndex].dialogo[index]
        }
    }
    var leftButton = SKLabelNode()
    var leftFrame = SKShapeNode()
    var rightButton = SKLabelNode()
    var rightFrame = SKShapeNode()
    func loadButtons(){
        leftButton = SKLabelNode()
        leftButton.name = "left"
        leftButton.text = situationArray![currrentIndex].left.desc
        leftButton.lineBreakMode = NSLineBreakMode.byWordWrapping
        leftButton.horizontalAlignmentMode = .center
        leftButton.numberOfLines = 2
        leftButton.preferredMaxLayoutWidth = CGFloat(150)
        leftButton.fontName = "Arial"
        leftButton.fontSize = 30
        leftButton.fontColor = .black
        leftButton.position = CGPoint(x: frame.midX - 100, y: frame.midY)
        leftButton.zPosition = 20
        leftButton.color = VerdeSecundario
        leftFrame = SKShapeNode()
        leftFrame.name = "left"
        leftFrame.path = UIBezierPath(roundedRect: CGRect(x: 0, y: 0, width: leftButton.frame.width + 50, height: leftButton.frame.height + 50), cornerRadius: 30).cgPath
        leftFrame.position = CGPoint(x: leftButton.position.x - leftFrame.frame.width/2, y: leftButton.position.y - 25)
        leftFrame.fillColor = VerdePrimario
        leftFrame.strokeColor = VerdeSecundario
        leftFrame.lineWidth = 3
        leftFrame.zPosition = 15
        addChild(leftFrame)
        addChild(leftButton)
        rightButton = SKLabelNode()
        rightButton.name = "right"
        rightButton.text = situationArray![currrentIndex].right.desc
        rightButton.lineBreakMode = NSLineBreakMode.byWordWrapping
        rightButton.numberOfLines = 2
        rightButton.preferredMaxLayoutWidth = CGFloat(150)
        rightButton.horizontalAlignmentMode = .center
        rightButton.fontName = "Arial"
        rightButton.fontSize = 30
        rightButton.fontColor = .black
        rightButton.position = CGPoint(x: frame.midX + 100, y: frame.midY)
        rightButton.zPosition = 20
        rightButton.color = VerdeSecundario
        rightFrame = SKShapeNode()
        rightFrame.name = "right"
        rightFrame.path = UIBezierPath(roundedRect: CGRect(x: 0, y: 0, width: rightButton.frame.width + 50, height: rightButton.frame.height + 50), cornerRadius: 30).cgPath
        rightFrame.position = CGPoint(x: rightButton.position.x - rightFrame.frame.width/2, y: rightButton.position.y - 25)
        rightFrame.fillColor = AmarilloPrimario
        rightFrame.strokeColor = AmarilloSecundario
        rightFrame.lineWidth = 3
        rightFrame.zPosition = 15
        addChild(rightFrame)
        addChild(rightButton)
    }
    func hideButtons(){
        leftButton.removeFromParent()
        leftFrame.removeFromParent()
        rightButton.removeFromParent()
        rightFrame.removeFromParent()
    }
    func loadCurrency(){
        currencyFrame.name = "Currency"
        currencyFrame.path = UIBezierPath(roundedRect: CGRect(x: 0, y: 0, width: 80, height: 30), cornerRadius: 30).cgPath
        currencyFrame.position = CGPoint(x: frame.minX + currencyFrame.frame.width/2 + 10, y: frame.maxY - currencyFrame.frame.height/2 - 25)
        currencyFrame.fillColor = VerdePrimario
        currencyFrame.strokeColor = VerdeSecundario
        addChild(currencyFrame)
        currencyLabel.name = "Currency"
        currencyLabel.fontName = "Arial"
        currencyLabel.fontSize = 20
        currencyLabel.fontColor = .black
        updateCurrency()
        addChild(currencyLabel)
    }
    func updateCurrency(){
        
        thisGame!.currency = max(thisGame!.currency, -99999)
        thisGame!.currency = min(thisGame!.currency, 999999)
        
        currencyLabel.text = "$\(thisGame!.currency)"
        currencyLabel.position = CGPoint(x: currencyFrame.position.x + currencyFrame.frame.width/2, y: currencyFrame.position.y + 10)
    }
    func loadReputation(){
        repIcon = SKSpriteNode(imageNamed: "Reputation Good")
        repIcon.name = "Reputation"
        repIcon.xScale = 0.05
        repIcon.yScale = 0.05
        repIcon.position = CGPoint(x: currencyFrame.frame.maxX + 40, y: currencyFrame.position.y + currencyFrame.frame.height/2)
        addChild(repIcon)
        let primColor = thisGame!.reputation >= 70 ? VerdePrimario : thisGame!.reputation >= 45 ? AmarilloPrimario : RojoPrimario
        let secoColor = thisGame!.reputation >= 70 ? VerdeSecundario : thisGame!.reputation >= 45 ? AmarilloSecundario : RojoSecundario
        repBaseBar = SKShapeNode()
        repBaseBar.path = UIBezierPath(roundedRect: CGRect(x: 0, y: 0, width: 100, height: 15), cornerRadius: 100).cgPath
        repBaseBar.position = CGPoint(x: repIcon.position.x + repIcon.size.width, y: repIcon.position.y - repIcon.frame.height/5)
        repBaseBar.fillColor = secoColor
        repBaseBar.strokeColor = primColor
        repBaseBar.lineWidth = 1
        addChild(repBaseBar)
        repActualAmount = SKShapeNode()
        repActualAmount.path = UIBezierPath(roundedRect: CGRect(x: 0, y: 0, width: thisGame!.reputation, height: 15), cornerRadius: 100).cgPath
        repActualAmount.position = CGPoint(x: repIcon.position.x + repIcon.size.width, y: repIcon.position.y - repIcon.frame.height/5)
        repActualAmount.fillColor = primColor
        repActualAmount.strokeColor = primColor
        repActualAmount.lineWidth = 1
        addChild(repActualAmount)
    }
    func updateReputation(){
        
        thisGame!.reputation = max(thisGame!.reputation, 0)
        thisGame!.reputation = min(thisGame!.reputation, 100)
        
        let primColor = thisGame!.reputation >= 70 ? VerdePrimario : thisGame!.reputation >= 45 ? AmarilloPrimario : RojoPrimario
        let secoColor = thisGame!.reputation >= 70 ? VerdeSecundario : thisGame!.reputation >= 45 ? AmarilloSecundario : RojoSecundario
        repIcon = SKSpriteNode(imageNamed: "Reputation Good")
        repBaseBar.path = UIBezierPath(roundedRect: CGRect(x: 0, y: 0, width: 100, height: 15), cornerRadius: 100).cgPath
        repBaseBar.fillColor = secoColor
        repBaseBar.strokeColor = primColor
        repActualAmount.path = UIBezierPath(roundedRect: CGRect(x: 0, y: 0, width: thisGame!.reputation, height: 15), cornerRadius: 100).cgPath
        repActualAmount.fillColor = primColor
        repActualAmount.strokeColor = primColor
    }
    func loadNoPerecederos(){
        noPerecederoIcon = SKSpriteNode(imageNamed: "No Perecederos")
        noPerecederoIcon.name = "No Perecederos"
        noPerecederoIcon.size = repIcon.size
        noPerecederoIcon.position = CGPoint(x: repIcon.frame.maxX + 150, y: repIcon.position.y)
        addChild(noPerecederoIcon)
        
        noPerecederoBar = SKShapeNode()
        noPerecederoAmount = SKShapeNode()
        updateNoPerecederos()
        
        noPerecederoBar.position = CGPoint(x: noPerecederoIcon.position.x + noPerecederoIcon.size.width, y: noPerecederoIcon.position.y - noPerecederoBar.frame.height/2)
        noPerecederoBar.lineWidth = 1
        addChild(noPerecederoBar)
        noPerecederoAmount.position = CGPoint(x: noPerecederoIcon.position.x + noPerecederoIcon.size.width, y: noPerecederoIcon.position.y - noPerecederoAmount.frame.height/2)
        noPerecederoAmount.lineWidth = 1
        addChild(noPerecederoAmount)
    }
    func updateNoPerecederos(){
        
        if(thisGame!.noPerecederos > thisGame!.maxNoPerecederos){
            thisGame!.noPerecederosThrowaway += thisGame!.noPerecederos - thisGame!.maxNoPerecederos
            thisGame!.currency -= (thisGame!.noPerecederos - thisGame!.maxNoPerecederos) * 5
            updateCurrency()
        }
        thisGame!.noPerecederos = max(thisGame!.noPerecederos, 0)
        thisGame!.noPerecederos = min(thisGame!.noPerecederos, thisGame!.maxNoPerecederos)
        
        let displayAmount = Double(Double(thisGame!.noPerecederos)/Double(thisGame!.maxNoPerecederos))*100
        let primColor = displayAmount >= 70 ? VerdePrimario : displayAmount >= 45 ? AmarilloPrimario : RojoPrimario
        let secoColor = displayAmount >= 70 ? VerdeSecundario : displayAmount >= 45 ? AmarilloSecundario : RojoSecundario
        noPerecederoBar.path = UIBezierPath(roundedRect: CGRect(x: 0, y: 0, width: 100, height: 15), cornerRadius: 100).cgPath
        noPerecederoBar.fillColor = secoColor
        noPerecederoBar.strokeColor = primColor
        noPerecederoAmount.path = UIBezierPath(roundedRect: CGRect(x: 0, y: 0, width: displayAmount, height: 15), cornerRadius: 100).cgPath
        noPerecederoAmount.fillColor = primColor
        noPerecederoAmount.strokeColor = primColor
    }
    func loadPerecederos(){
        perecederoIcon = SKSpriteNode(imageNamed: "Perecederos")
        perecederoIcon.name = "Perecederos"
        perecederoIcon.size = repIcon.size
        perecederoIcon.position = CGPoint(x: noPerecederoIcon.frame.maxX + 150, y: repIcon.position.y)
        addChild(perecederoIcon)
        
        perecederoBar = SKShapeNode()
        perecederoAmount = SKShapeNode()
        updatePerecederos()
        
        perecederoBar.position = CGPoint(x: perecederoIcon.position.x + perecederoIcon.size.width, y: perecederoIcon.position.y - perecederoBar.frame.height/2)
        perecederoBar.lineWidth = 1
        perecederoAmount.position = CGPoint(x: perecederoIcon.position.x + perecederoIcon.size.width, y: perecederoIcon.position.y - perecederoAmount.frame.height/2)
        perecederoAmount.lineWidth = 1
        addChild(perecederoBar)
        addChild(perecederoAmount)
    }
    func updatePerecederos(){
        
        if(thisGame!.perecederos > thisGame!.maxPerecederos){
            thisGame!.perecederosThrowaway += thisGame!.perecederos - thisGame!.maxPerecederos
            thisGame!.currency -= (thisGame!.perecederos - thisGame!.maxPerecederos) * 15
            updateCurrency()
        }
        thisGame!.perecederos = max(thisGame!.perecederos, 0)
        thisGame!.perecederos = min(thisGame!.perecederos, thisGame!.maxPerecederos)
        thisGame!.perecederosThrowaway += Int(Double(thisGame!.perecederos) * thisGame!.throwaway)
        thisGame!.perecederos = max(thisGame!.perecederos, 0)
        thisGame!.perecederos = min(thisGame!.perecederos, thisGame!.maxPerecederos)
        
        let displayAmount = Double(Double(thisGame!.perecederos)/Double(thisGame!.maxPerecederos))*100
        let primColor = displayAmount >= 70 ? VerdePrimario : displayAmount >= 45 ? AmarilloPrimario : RojoPrimario
        let secoColor = displayAmount >= 70 ? VerdeSecundario : displayAmount >= 45 ? AmarilloSecundario : RojoSecundario
        perecederoBar.path = UIBezierPath(roundedRect: CGRect(x: 0, y: 0, width: 100, height: 15), cornerRadius: 100).cgPath
        perecederoBar.fillColor = secoColor
        perecederoBar.strokeColor = primColor
        perecederoAmount.path = UIBezierPath(roundedRect: CGRect(x: 0, y: 0, width: displayAmount, height: 15), cornerRadius: 100).cgPath
        perecederoAmount.fillColor = primColor
        perecederoAmount.strokeColor = primColor
    }
    override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
        let touch = touches.first
        if let location = touch?.location(in: self){
            let nodesArray = self.nodes(at: location)
            var currentSituation: Modifier
            
            if(nodesArray.first?.name == "left"){
                currentSituation = situationArray![currrentIndex].left
                thisGame!.currency += currentSituation.moneyDiff!
                thisGame!.reputation += Double(currentSituation.repDiff!)*100
                if(currrentIndex == situationArray!.count-1){
                    thisGame!.noPerecederos += (thisGame!.maxNoPerecederos * currentSituation.npDiff!)/100
                    thisGame!.currency -= (thisGame!.maxNoPerecederos * currentSituation.npDiff!)/100 * 3
                }else{
                    thisGame!.noPerecederos += currentSituation.npDiff!
                }
                thisGame!.perecederos += currentSituation.perDiff!
                thisGame!.maxPerecederos += currentSituation.modifierMaxper!
                thisGame!.maxNoPerecederos += currentSituation.modifierMaxnp!
                thisGame!.recibe += currentSituation.modifierPereReceive! * 100
                thisGame!.throwaway += currentSituation.modifierPereTrash!
                thisGame!.comunidades += currentSituation.modifierComunidades!
                
                updateReputation()
                updatePerecederos()
                updateNoPerecederos()
                updateCurrency()
                
                if(faltaDonar){
                    donarFoods()
                }else{
                    thisGame!.rounds += 1
                    autoSave()
                    let transition = SKTransition.fade(withDuration: 0.5)
                    let nextScene = GameScene(size: self.size)
                    self.view?.presentScene(nextScene, transition: transition)
                }
            }	
            else if(nodesArray.first?.name == "right"){
                currentSituation = situationArray![currrentIndex].right
                thisGame!.currency += currentSituation.moneyDiff!
                thisGame!.reputation += Double(currentSituation.repDiff!)*100
                if(currrentIndex == situationArray!.count-1){
                    thisGame!.noPerecederos += (thisGame!.maxNoPerecederos * currentSituation.npDiff!)/100
                    thisGame!.currency -= (thisGame!.maxNoPerecederos * currentSituation.npDiff!)/100 * 3
                }else{
                    thisGame!.noPerecederos += currentSituation.npDiff!
                }
                thisGame!.perecederos += currentSituation.perDiff!
                thisGame!.maxPerecederos += currentSituation.modifierMaxper!
                thisGame!.maxNoPerecederos += currentSituation.modifierMaxnp!
                thisGame!.recibe += currentSituation.modifierPereReceive! * 100
                thisGame!.throwaway += currentSituation.modifierPereTrash!
                thisGame!.comunidades += currentSituation.modifierComunidades!
                
                updateReputation()
                updatePerecederos()
                updateNoPerecederos()
                updateCurrency()
                if(faltaDonar){
                    donarFoods()
                }else{
                    thisGame!.rounds += 1
                    autoSave()
                    let transition = SKTransition.fade(withDuration: 0.5)
                    let nextScene = GameScene(size: self.size)
                    self.view?.presentScene(nextScene, transition: transition)
                }
            }
            
            if(nodesArray.first?.name == "Continue Description"){
                dialogueIndex += 1
                if(dontBuy){
                    updateMessage(index: dialogueIndex)
                }else{
                    buyCans(index: dialogueIndex)
                }
                
            }
            if(nodesArray.first?.name == "GTFO"){
                autoSave()
                let transition = SKTransition.fade(withDuration: 0.5)
                let nextScene = MenuScene(size: self.size)
                self.view?.presentScene(nextScene, transition: transition)
            }
        }
    }
    func donarFoods(){
        faltaDonar = false
        let pa = Int.random(in: 20 ..< 100)
        let npa = Int.random(in: 10 ..< 30)
        bg.texture = SKTexture(imageNamed: "BGComunidad")
        
        situationArray![currrentIndex].dialogo.append("Actualmente atendemos a \(thisGame!.comunidades) comunidades")
        situationArray![currrentIndex].dialogo.append("Se requirio de \(thisGame!.comunidades * pa) alimentos perecederos")
        situationArray![currrentIndex].dialogo.append("Y \(thisGame!.comunidades * npa) de alimentos no perecederos")
        thisGame!.perecederos -= pa * thisGame!.comunidades
        thisGame!.noPerecederos -= npa * thisGame!.comunidades
        
        if(thisGame!.noPerecederos < 0 || thisGame!.perecederos < 0){
            autoSave()
            let transition = SKTransition.fade(withDuration: 0.5)
            let nextScene = GameOver(size: self.size)
            self.view?.presentScene(nextScene, transition: transition)
        }
        
        thisGame!.donated += (npa * thisGame!.comunidades) + (pa * thisGame!.comunidades)
        thisGame!.currency += (pa * thisGame!.comunidades / Int.random(in: 15 ..< 45)) * 15 + (npa * thisGame!.comunidades / Int.random(in: 15 ..< 45)) * 5
        updatePerecederos()
        updateNoPerecederos()
        updateCurrency()
        hideButtons()
        showMessage()
        
        updateMessage(index: dialogueIndex)
    }
    func autoSave(){
        let savedGameURL = Bundle.main.url(forResource: "saved", withExtension: "json")!        
        let gameData = try! JSONEncoder().encode(thisGame)
        let gameString = String(data: gameData, encoding: .utf8)!
        try? gameString.write(to: savedGameURL, atomically: false, encoding: .utf8)
    }
    func buyCans(index: Int){
        if( index == situationArray![currrentIndex].dialogo.count ){
            message.removeFromParent()
            nextMessage.removeFromParent()
            textBox.removeFromParent()
            loadButtons()
        }
        else{
            message.text = situationArray![currrentIndex].dialogo[index]
        }
    }
}
