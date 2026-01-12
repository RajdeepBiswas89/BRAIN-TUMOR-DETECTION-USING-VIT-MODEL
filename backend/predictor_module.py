
import torch
import torch.nn as nn
import torchvision.transforms as transforms
from PIL import Image
import torchvision

class BrainTumorViT(nn.Module):
    def __init__(self, num_classes=4):
        super(BrainTumorViT, self).__init__()
        self.vit = torchvision.models.vit_b_16(pretrained=False)
        self.vit.heads = nn.Sequential(
            nn.Linear(self.vit.heads.head.in_features, 256),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(256, num_classes)
        )
        
    def forward(self, x):
        return self.vit(x)

class BrainTumorPredictor:
    def __init__(self, model_path):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model = self.load_model(model_path)
        self.classes = ['Glioma', 'Meningioma', 'No Tumor', 'Pituitary']
        self.image_size = 224
        
        self.transform = transforms.Compose([
            transforms.Resize((self.image_size, self.image_size)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                               std=[0.229, 0.224, 0.225])
        ])
        
    def load_model(self, model_path):
        checkpoint = torch.load(model_path, map_location=self.device)
        model = BrainTumorViT(num_classes=checkpoint['num_classes'])
        model.load_state_dict(checkpoint['model_state_dict'])
        model.to(self.device)
        model.eval()
        return model
    
    def predict(self, image):
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        input_tensor = self.transform(image).unsqueeze(0).to(self.device)
        
        with torch.no_grad():
            outputs = self.model(input_tensor)
            probabilities = torch.softmax(outputs, dim=1)
            confidence, prediction = torch.max(probabilities, 1)
            
        return {
            'prediction': self.classes[prediction.item()],
            'confidence': confidence.item(),
            'probabilities': {
                cls: prob.item() for cls, prob in zip(self.classes, probabilities[0])
            }
        }

# Singleton instance
_predictor_instance = None

def get_predictor(model_path='vit_brain_tumor_metadata.pth'):
    global _predictor_instance
    if _predictor_instance is None:
        _predictor_instance = BrainTumorPredictor(model_path)
    return _predictor_instance
