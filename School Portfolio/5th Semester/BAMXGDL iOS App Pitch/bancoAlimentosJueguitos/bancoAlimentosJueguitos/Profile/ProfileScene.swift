//
//  ProfileScene.swift
//  bancoAlimentosJueguitos
//
//  Created by Javier Lizarraga on 18/10/21.
//

import SpriteKit
import UIKit

class ProfileScene: SKScene{
    
    
    
    override func didMove(to view: SKView) {
        let lb = SKSpriteNode(imageNamed: "escButton")
        lb.name = "Leaderboard"
        lb.size = CGSize(width: 0.08 * lb.size.width, height: 0.08 * lb.size.height)
        lb.position = CGPoint(x: frame.minX + 50, y: frame.minY + 350)
        addChild(lb)
        let bg = SKSpriteNode(imageNamed: "MenuBackground")
        bg.name = "Background"
        bg.blendMode = .replace
        bg.zPosition = -1
        bg.size = CGSize(width: frame.size.width, height: frame.size.height)
        bg.position = CGPoint(x: frame.size.width/2, y: frame.size.height/2)
        addChild(bg)
        physicsWorld.gravity = .zero
        let textBox = SKShapeNode()
        textBox.path = UIBezierPath(roundedRect: CGRect(x: 0, y: 0, width: frame.width * 0.2, height: frame.height * 0.7), cornerRadius: 15).cgPath
        textBox.position = CGPoint(x: frame.midX - frame.width*0.1, y: frame.minY + 80)
        textBox.fillColor = UIColor(white: 1, alpha: 0.7)
        textBox.strokeColor = UIColor.black
        textBox.lineWidth = 1
        textBox.zPosition = 1
        addChild(textBox)
        let textBox2 = SKShapeNode()
        textBox2.path = UIBezierPath(roundedRect: CGRect(x: 0, y: 0, width: frame.width * 0.2, height: frame.height * 0.7), cornerRadius: 15).cgPath
        textBox2.position = CGPoint(x: frame.midX - frame.width*0.35, y: frame.minY + 80)
        textBox2.fillColor = UIColor(white: 1, alpha: 0.7)
        textBox2.strokeColor = UIColor.black
        textBox2.lineWidth = 1
        textBox2.zPosition = 1
        addChild(textBox2)
        let textBox3 = SKShapeNode()
        textBox3.path = UIBezierPath(roundedRect: CGRect(x: 0, y: 0, width: frame.width * 0.2, height: frame.height * 0.7), cornerRadius: 15).cgPath
        textBox3.position = CGPoint(x: frame.midX + frame.width*0.15, y: frame.minY + 80)
        textBox3.fillColor = UIColor(white: 1, alpha: 0.7)
        textBox3.strokeColor = UIColor.black
        textBox3.lineWidth = 1
        textBox3.zPosition = 1
        addChild(textBox3)
        //create/shape image
        var spritee = SKSpriteNode()
        var aaa = CGSize(width: 70, height: 70)
        var bbb = CGFloat(35)
        var imagee = resizedImage(aaa: "fototo",for: aaa) as! UIImage
        var image = maskRoundedImage(image: imagee, radius: bbb)
        let texture = SKTexture(image: image)
        spritee = SKSpriteNode(texture: texture)
        spritee.position = CGPoint(x: frame.midX - frame.width*0.25, y: frame.minY + frame.height * 0.75 )
        spritee.zPosition = 1
        addChild(spritee)
        
        let message = SKLabelNode()
        message.text = "coolerSteve"
        message.lineBreakMode = NSLineBreakMode.byWordWrapping
        message.preferredMaxLayoutWidth = CGFloat(frame.width * 0.8)
        message.fontName = "Arial"
        message.fontSize = 20
        message.fontColor = .black
        message.position = CGPoint(x: frame.midX - frame.width*0.25, y: frame.minY + frame.height * 0.6 )
        message.zPosition = 2
        addChild(message)
        let message2 = SKLabelNode()
        message2.verticalAlignmentMode = SKLabelVerticalAlignmentMode.center
        message2.horizontalAlignmentMode = SKLabelHorizontalAlignmentMode.center
        message2.text = "     9  Partidas Jugadas "
        
        message2.lineBreakMode = NSLineBreakMode.byWordWrapping
        message2.numberOfLines = 4
        message2.preferredMaxLayoutWidth = CGFloat(frame.width * 0.12)
        message2.fontName = "Arial"
        message2.fontSize = 20
        message2.fontColor = .black
        message2.position = CGPoint(x: frame.midX - frame.width*0.25, y: frame.minY + frame.height * 0.35 )
        message2.zPosition = 2
        addChild(message2)
        
        var spritee2 = SKSpriteNode()
        var imagee2 = resizedImage(aaa: "No Perecederos",for: aaa) as! UIImage
        let texture2 = SKTexture(image: imagee2)
        spritee2 = SKSpriteNode(texture: texture2)
        spritee2.position = CGPoint(x: frame.midX , y: frame.minY + frame.height * 0.75 )
        spritee2.zPosition = 1
        addChild(spritee2)
        
        let message3 = SKLabelNode()
        message3.text = "Impacto"
        message3.lineBreakMode = NSLineBreakMode.byWordWrapping
        message3.preferredMaxLayoutWidth = CGFloat(frame.width * 0.8)
        message3.fontName = "Arial"
        message3.fontSize = 20
        message3.fontColor = .black
        message3.position = CGPoint(x: frame.midX , y: frame.minY + frame.height * 0.6 )
        message3.zPosition = 2
        addChild(message3)
        let message22 = SKLabelNode()
        message22.verticalAlignmentMode = SKLabelVerticalAlignmentMode.center
        message22.horizontalAlignmentMode = SKLabelHorizontalAlignmentMode.center
        message22.text = "         52  Comunidades Ayudadas "
        
        message22.lineBreakMode = NSLineBreakMode.byWordWrapping
        message22.numberOfLines = 4
        message22.preferredMaxLayoutWidth = CGFloat(frame.width * 0.16)
        message22.fontName = "Arial"
        message22.fontSize = 18
        message22.fontColor = .black
        message22.position = CGPoint(x: frame.midX , y: frame.minY + frame.height * 0.35 )
        message22.zPosition = 2
        addChild(message22)
        
        var spritee3 = SKSpriteNode()
        var imagee3 = resizedImage(aaa: "truck",for: aaa) as! UIImage
        let texture3 = SKTexture(image: imagee3)
        spritee3 = SKSpriteNode(texture: texture3)
        spritee3.position = CGPoint(x: frame.midX + frame.width*0.25, y: frame.minY + frame.height * 0.75 )
        spritee3.zPosition = 1
        addChild(spritee3)
        
        let message4 = SKLabelNode()
        message4.text = "Mejor Partida"
        message4.lineBreakMode = NSLineBreakMode.byWordWrapping
        message4.preferredMaxLayoutWidth = CGFloat(frame.width * 0.8)
        message4.fontName = "Arial"
        message4.fontSize = 20
        message4.fontColor = .black
        message4.position = CGPoint(x:frame.midX + frame.width*0.25, y: frame.minY + frame.height * 0.6 )
        message4.zPosition = 2
        addChild(message4)
        let message23 = SKLabelNode()
        message23.verticalAlignmentMode = SKLabelVerticalAlignmentMode.center
        message23.horizontalAlignmentMode = SKLabelHorizontalAlignmentMode.center
        message23.text = "Reputacion: 100%         Dinero: $512351 Rondas:          13 "
        
        message23.lineBreakMode = NSLineBreakMode.byWordWrapping
        message23.numberOfLines = 6
        message23.preferredMaxLayoutWidth = CGFloat(frame.width * 0.16)
        message23.fontName = "Arial"
        message23.fontSize = 17
        message23.fontColor = .black
        message23.position = CGPoint(x: frame.midX + frame.width*0.25, y: frame.minY + frame.height * 0.38 )
        message23.zPosition = 2
        addChild(message23)
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
    func maskRoundedImage(image: UIImage, radius: CGFloat) -> UIImage {
            let imageView: UIImageView = UIImageView(image: image)
            let layer = imageView.layer
            layer.masksToBounds = true
            layer.cornerRadius = radius
            UIGraphicsBeginImageContext(imageView.bounds.size)
            layer.render(in: UIGraphicsGetCurrentContext()!)
            let roundedImage = UIGraphicsGetImageFromCurrentImageContext()
            UIGraphicsEndImageContext()
            return roundedImage!
        }
    override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
        let touch = touches.first
        if let location = touch?.location(in: self){
            let nodesArray = self.nodes(at: location)
            if(nodesArray.first?.name == "Leaderboard"){
                let transition = SKTransition.fade(withDuration: 0.5)
                let nextScene = LeaderboardScene(size: self.size)
                self.view?.presentScene(nextScene, transition: transition)
            }
        }
    }
}

