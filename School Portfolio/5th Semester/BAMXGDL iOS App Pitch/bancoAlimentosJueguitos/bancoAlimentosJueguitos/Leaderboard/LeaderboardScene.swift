//
//  LeaderboardScene.swift
//  bancoAlimentosJueguitos
//
//  Created by user195798 on 10/4/21.
//

import SpriteKit
import UIKit
import FirebaseFirestore

class GameRoomTableView: UITableView,UITableViewDelegate,UITableViewDataSource {
    var items: [String] = ["Cargando..."]
    
    override init(frame: CGRect, style: UITableView.Style) {
        super.init(frame: frame, style: style)
        self.delegate = self
        self.dataSource = self
        
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    // MARK: - Table view data source
    func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        print(items.count)
        return items.count
    }
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell:UITableViewCell = tableView.dequeueReusableCell(withIdentifier: "cell")! as UITableViewCell
        cell.textLabel?.text = self.items[indexPath.row]
        cell.backgroundColor = .clear
        cell.backgroundConfiguration = .none
        let bgColorView = UIView()
        bgColorView.backgroundColor = .clear
        cell.selectedBackgroundView = bgColorView
        return cell
    }
    func tableView(_ tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        
        return "#     Name        XP"
    }
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        
        print("You selected cell #\(indexPath.row)!")
    }
}

class LeaderboardScene: SKScene {
    var gameTableView = GameRoomTableView()
    var num = 0
    var xp = 0
    var message = SKLabelNode()
    
    var label1 = SKLabelNode()
    var label2 = SKLabelNode()
    var label3 = SKLabelNode()
    
    override func didMove(to view: SKView) {
        let mn = SKSpriteNode(imageNamed: "home")
        mn.name = "Menu"
        mn.size = CGSize(width: 0.08 * mn.size.width, height: 0.08 * mn.size.height)
        mn.position = CGPoint(x: frame.minX + 50, y: frame.minY + 350)
        addChild(mn)
        
        let pr = SKSpriteNode(imageNamed: "profile")
        pr.name = "Profile"
        pr.size = CGSize(width: 0.08 * pr.size.width, height: 0.08 * pr.size.height)
        pr.position = CGPoint(x: frame.minX + 50, y: frame.minY + 250)
        addChild(pr)
        
        let bg = SKSpriteNode(imageNamed: "MenuBackground")
        bg.name = "Background"
        bg.blendMode = .replace
        bg.zPosition = -1
        bg.size = CGSize(width: frame.size.width, height: frame.size.height)
        bg.position = CGPoint(x: frame.size.width/2, y: frame.size.height/2)
        addChild(bg)
        physicsWorld.gravity = .zero
        gameTableView.register(UITableViewCell.self, forCellReuseIdentifier: "cell")
        gameTableView.frame=CGRect(x:550,y:50,width:250,height:200)
        gameTableView.backgroundColor = UIColor(white: 1, alpha: 0.7)
        loadData()
        view.addSubview(gameTableView)
        gameTableView.reloadData()
        
        let textBox = SKShapeNode()
        textBox.path = UIBezierPath(roundedRect: CGRect(x: 0, y: 0, width: frame.width * 0.8, height: 50), cornerRadius: 15).cgPath
        textBox.position = CGPoint(x: frame.midX - frame.width*0.4, y: frame.minY + 30)
        textBox.fillColor = UIColor.white
        textBox.strokeColor = UIColor.black
        textBox.lineWidth = 1
        textBox.zPosition = 1
        addChild(textBox)
        
        message.text = "cargando......."
        message.lineBreakMode = NSLineBreakMode.byWordWrapping
        message.preferredMaxLayoutWidth = CGFloat(frame.width * 0.8)
        message.fontName = "Arial"
        message.fontSize = 25
        message.fontColor = .black
        message.position = CGPoint(x: frame.midX, y: textBox.frame.maxY - 30)
        message.zPosition = 2
        addChild(message)
        var aaa = CGSize(width: 250, height: 250)
        var spritee3 = SKSpriteNode()
        var imagee3 = resizedImage(aaa: "checocs",for: aaa) as! UIImage
        let texture3 = SKTexture(image: imagee3)
        spritee3 = SKSpriteNode(texture: texture3)
        spritee3.position = CGPoint(x: frame.midX - frame.width*0.15, y: frame.minY + frame.height * 0.6 )
        spritee3.zPosition = 2
        
        label1.text = "...cargando"
        label1.zPosition = 5
        label1.preferredMaxLayoutWidth = CGFloat(frame.width * 0.8)
        label1.fontName = "Arial"
        label1.fontSize = 25
        label1.fontColor = .black
        label1.position = CGPoint(x: frame.midX - 100, y: frame.maxY - 30)
        
        label2.text = "...cargando"
        label2.zPosition = 5
        label2.preferredMaxLayoutWidth = CGFloat(frame.width * 0.8)
        label2.fontName = "Arial"
        label2.fontSize = 25
        label2.fontColor = .black
        label2.position = CGPoint(x: frame.midX - 200, y: frame.maxY - 120)
        
        label3.text = "...cargando"
        label3.zPosition = 5
        label3.preferredMaxLayoutWidth = CGFloat(frame.width * 0.8)
        label3.fontName = "Arial"
        label3.fontSize = 25
        label3.fontColor = .black
        label3.position = CGPoint(x: frame.midX - 20, y: frame.maxY - 170)
        
        addChild(label1)
        addChild(label2)
        addChild(label3)
        addChild(spritee3)
        
    }
    func loadData(){
        let db = Firestore.firestore()
        let gola = db.collection("Usuarios").order(by: "xp", descending: true)
        gola.getDocuments(){ (querySnapshot, err) in
            if let err = err {
                print("Error getting documents: \(err)")
            } else {
                self.gameTableView.items.popLast()
                var i=1
                for document in querySnapshot!.documents {
                    var nombre = document.data()["Nombre"] ?? "nial"
                    if (  nombre as! String == "coolerSteve"){
                        self.xp = document.data()["xp"] as! Int
                        self.num = i
                        self.message.text = "coolerSteve te encuentras en #\(self.num) con  \(self.xp) xp"
                    }
                    if (i == 1){
                        self.label1.text = "\(nombre)"
                    }
                    if (i == 3){
                        self.label3.text = "\(nombre)"
                    }
                    if (i == 2){
                        self.label2.text = "\(nombre)"
                    }
                    print(document.data()["Nombre"] ?? "NIL")
                    self.gameTableView.items.append("#\(i)    \(document.data()["Nombre"] ?? "niAl")   \(document.data()["xp"] ?? "nil")")
                i+=1
                }
                self.gameTableView.reloadData()
            }
        }
        
    }
    override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
        let touch = touches.first
        if let location = touch?.location(in: self){
            let nodesArray = self.nodes(at: location)
            if(nodesArray.first?.name == "Menu"){
                let transition = SKTransition.fade(withDuration: 0.5)
                self.gameTableView.removeFromSuperview()
                let nextScene = MenuScene(size: self.size)
                self.view?.presentScene(nextScene, transition: transition)
            }
            if(nodesArray.first?.name == "Profile"){
                let transition = SKTransition.fade(withDuration: 0.5)
                self.gameTableView.removeFromSuperview()
                let nextScene = ProfileScene(size: self.size)
                self.view?.presentScene(nextScene, transition: transition)
            }
        }
    }
    func resizedImage(aaa: String,for size: CGSize) -> UIImage? {
        guard let image = UIImage(named: aaa) else {
            return nil
        }

        let renderer = UIGraphicsImageRenderer(size: size)
        return renderer.image { (context) in
            image.draw(in: CGRect(origin: .zero, size: size))
        }
    }
}
