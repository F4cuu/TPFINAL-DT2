# Parachute Push

**"Está mal, pero no tan mal"**

## Estudiante

Nombre: Ibañez Facundo

## Descripción

Un avión se va a estrellar. En lugar de evitar la catástrofe, empujás a los pasajeros fuera del avión para que usen sus paracaídas. La situación está mal, pero tienen paracaídas, así que "no tan mal".

Atravesá 3 niveles esquivando objetos que caen, juntando monedas y salvando NPCs antes de que el tiempo se acabe. En el nivel 3 aparece un pasajero hostil que te persigue.

## Controles

| Tecla | Acción |
|-------|--------|
| ↑ ↓ ← → | Movimiento |
| BARRA ESPACIADORA | Empujar NPC cercano |

Si apretás ESPACIO sin un NPC cerca, perdés 5 puntos.

## Puntajes

| Acción | Puntos |
|--------|--------|
| Salvar un NPC | +10 |
| Recoger moneda | +5 |
| Empujar sin NPC | -5 |
| Golpe de obstáculo | -10 |
| Golpe de enemigo | -10 |

## Niveles

- **Nivel 1**: 4 NPCs, 60 segundos. Objetos caen cada 2s.
- **Nivel 2**: 5 NPCs, 50 segundos. Pasillos más angostos. Objetos caen cada 1.5s.
- **Nivel 3**: 6 NPCs, 40 segundos. Aparece un enemigo hostil. Objetos caen cada 1s.

## Link al juego

[Jugar online](https://github.com/F4cuu/TPFINAL-DT2)

## Tecnología

- Phaser 4.1.0
- JavaScript (ES6+)
- Canvas 800×600 con escalado multidispositivo

## Archivos del proyecto

- `game.js` — Configuración de Phaser
- `helpers.js` — Generación de texturas en preload()
- `scenes/BaseLevel.js` — Clase base con lógica común
- `scenes/MenuScene.js` — Menú principal
- `scenes/Level1Scene.js` — Nivel 1
- `scenes/Level2Scene.js` — Nivel 2
- `scenes/Level3Scene.js` — Nivel 3
- `scenes/GameOverScene.js` — Pantalla de derrota
- `scenes/VictoryScene.js` — Pantalla de victoria
- `GDD.txt` — Game Design Document
