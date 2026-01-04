#!/usr/bin/env python3
"""
Demo script para probar los 3 modelos de visión artificial más populares de Hugging Face
"""

import requests
import json
import time
from pathlib import Path

def test_api_endpoint(endpoint, description):
    """Prueba un endpoint de la API"""
    print(f"\n🔍 Probando {description}...")
    try:
        response = requests.get(f"http://localhost:8000/{endpoint}", timeout=5)
        if response.status_code == 200:
            print(f"✅ {description} - API disponible")
            return True
        else:
            print(f"❌ {description} - Error {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ {description} - Error de conexión: {e}")
        return False

def main():
    print("🤖 Demo de los 3 Modelos de Visión Artificial Más Populares de Hugging Face")
    print("=" * 80)
    
    # Verificar que la API esté funcionando
    print("\n📡 Verificando conexión con la API...")
    if not test_api_endpoint("", "API principal"):
        print("\n❌ La API no está disponible. Asegúrate de que el servidor esté ejecutándose:")
        print("   uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000")
        return
    
    # Obtener información de los modelos
    try:
        response = requests.get("http://localhost:8000/")
        data = response.json()
        print(f"\n📋 Modelos disponibles:")
        for i, model in enumerate(data["models"], 1):
            print(f"   {i}. {model}")
    except Exception as e:
        print(f"❌ Error obteniendo información de modelos: {e}")
        return
    
    print("\n" + "=" * 80)
    print("🎯 CAPACIDADES DE CADA MODELO")
    print("=" * 80)
    
    print("\n1️⃣  CLIP (openai/clip-vit-base-patch32)")
    print("   🎯 Qué hace: Clasificación zero-shot usando texto y imágenes")
    print("   💡 Capacidades:")
    print("      • Puede clasificar imágenes usando descripciones en lenguaje natural")
    print("      • No necesita entrenamiento previo para nuevas categorías")
    print("      • Entiende la relación entre texto e imágenes")
    print("   📝 Ejemplo de uso:")
    print("      • Input: Imagen + ['una persona', 'un animal', 'un objeto']")
    print("      • Output: Probabilidades para cada categoría")
    
    print("\n2️⃣  ViT (google/vit-base-patch16-224)")
    print("   🔍 Qué hace: Clasificación de imágenes usando Vision Transformer")
    print("   💡 Capacidades:")
    print("      • Clasifica imágenes en 1000 categorías de ImageNet")
    print("      • Muy preciso para objetos comunes")
    print("      • Basado en arquitectura Transformer")
    print("   📝 Ejemplo de uso:")
    print("      • Input: Imagen")
    print("      • Output: ['Golden Retriever 85%', 'Labrador 12%', 'Beagle 3%']")
    
    print("\n3️⃣  DETR (facebook/detr-resnet-50)")
    print("   📦 Qué hace: Detección de objetos usando Detection Transformer")
    print("   💡 Capacidades:")
    print("      • Detecta y localiza múltiples objetos en una imagen")
    print("      • Dibuja cajas delimitadoras alrededor de objetos")
    print("      • Puede detectar múltiples instancias del mismo objeto")
    print("   📝 Ejemplo de uso:")
    print("      • Input: Imagen")
    print("      • Output: [{'label': 'person', 'box': [x,y,w,h], 'score': 0.95}]")
    
    print("\n" + "=" * 80)
    print("🚀 CÓMO USAR LA APLICACIÓN")
    print("=" * 80)
    
    print("\n1. 📱 Abre el frontend en tu navegador:")
    print("   file:///path/to/frontend/index.html")
    
    print("\n2. 📷 Permite acceso a la cámara cuando se solicite")
    
    print("\n3. 🎮 Prueba cada modelo:")
    print("   • 🔍 ViT Classifier: Clasifica lo que ve la cámara")
    print("   • 🎯 CLIP Zero-Shot: Clasifica usando categorías predefinidas")
    print("   • 📦 DETR Object Detection: Detecta y marca objetos con cajas")
    print("   • 🎨 CLIP Custom: Usa tus propios prompts de texto")
    
    print("\n4. 🎨 Para CLIP Custom, prueba prompts como:")
    print("   • 'una persona feliz, una persona triste, una persona neutral'")
    print("   • 'un gato, un perro, un pájaro'")
    print("   • 'comida, bebida, tecnología'")
    
    print("\n" + "=" * 80)
    print("💡 CASOS DE USO PRÁCTICOS")
    print("=" * 80)
    
    print("\n🏥 CLIP - Análisis médico:")
    print("   Prompts: 'radiografía normal, fractura, inflamación'")
    
    print("\n🛒 ViT - E-commerce:")
    print("   Clasificar productos automáticamente por categoría")
    
    print("\n🚗 DETR - Vehículos autónomos:")
    print("   Detectar peatones, carros, señales de tráfico")
    
    print("\n🏭 DETR - Control de calidad:")
    print("   Detectar defectos en productos manufacturados")
    
    print("\n📱 CLIP - Redes sociales:")
    print("   Moderar contenido: 'contenido apropiado, contenido inapropiado'")
    
    print("\n" + "=" * 80)
    print("✨ ¡La aplicación está lista para usar!")
    print("   Abre el frontend y experimenta con tu cámara")
    print("=" * 80)

if __name__ == "__main__":
    main()
