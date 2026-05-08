
    document.addEventListener('DOMContentLoaded', () => {
        // --- Game Setup ---
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');

        // Low internal resolution for the 16x16 feel, scaled up.
        const internalResWidth = 80;
        const internalResHeight = 60;
        const scale = 8; // Each "pixel" will be 8x8 on the final canvas

        canvas.width = internalResWidth * scale;
        canvas.height = internalResHeight * scale;

        // --- Favicon Setup ---
        const faviconLink = document.getElementById('favicon');
        const faviconCanvas = document.createElement('canvas');
        faviconCanvas.width = 16;
        faviconCanvas.height = 16;
        const faviconCtx = faviconCanvas.getContext('2d');
        let frameCount = 0;
        const faviconUpdateFrequency = 5; // Update favicon every 5 frames for performance

        // HUD and Overlay Elements
        const healthUI = document.getElementById('health');
        const ammoUI = document.getElementById('ammo');
        const enemiesLeftUI = document.getElementById('enemiesLeft');
        const overlay = document.getElementById('overlay');
        const startButton = document.getElementById('startButton');

        // --- Game State ---
        let gameRunning = false;
        let map = [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,2,0,0,3,0,1,1,0,3,0,0,2,0,1],
            [1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1],
            [1,0,3,0,0,0,0,0,0,0,0,0,0,3,0,1],
            [1,0,0,0,0,1,1,0,0,1,1,0,0,0,0,1],
            [1,0,2,0,0,1,1,0,0,1,1,0,0,2,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,2,0,0,3,0,1,1,0,3,0,0,2,0,1],
            [1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1],
            [1,0,3,0,0,0,0,0,0,0,0,0,0,3,0,1],
            [1,0,0,0,0,1,1,1,1,1,1,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        ];
        const mapWidth = map[0].length;
        const mapHeight = map.length;

        // Player State
        let player = {
            x: 1.5,
            y: 1.5,
            dirX: 1, // Start facing right for a change
            dirY: 0,
            planeX: 0,
            planeY: -0.66,
            moveSpeed: 0.05,
            rotSpeed: 0.03,
            health: 100,
            ammo: 50,
        };

        // Sprites (Demons)
        let sprites = [
            // type 1 = demon
            { x: 3.5, y: 3.5, type: 1, state: 'alive', health: 100 },
            { x: 7.5, y: 12.5, type: 1, state: 'alive', health: 100 },
            { x: 12.5, y: 4.5, type: 1, state: 'alive', health: 100 },
            { x: 9.5, y: 10.5, type: 1, state: 'alive', health: 100 },
            { x: 1.5, y: 12.5, type: 1, state: 'alive', health: 100 },
        ];
        let zBuffer = new Array(internalResWidth);

        // Input State
        let keys = {};
        
        // --- Textures ---
        const textures = {
            // Define colors for different wall types
            1: { color: '#7b6a53', shade: '#5b4e3d' }, // Brown stone
            2: { color: '#4a5a8a', shade: '#3a4a6a' }, // Blue brick (changed from red to avoid confusion with demons)
            3: { color: '#4a6b4a', shade: '#3a5b3a' }, // Green mossy stone
        };

        const spriteTextures = {
            1: { // Demon colors - improved demonic appearance
                body: '#8B0000',      // Dark red (darker than before)
                eye: '#FF4500',       // Orange-red glowing eyes
                horn: '#2F1B14',      // Dark brown/black horns
                highlight: '#FF6B6B'  // Light red highlight
            },
        };

        // --- Core Game Loop ---
        function gameLoop() {
            if (!gameRunning) return;
            
            update();
            render();

            // Throttled favicon update
            frameCount++;
            if (frameCount % faviconUpdateFrequency === 0) {
                updateFavicon();
            }

            requestAnimationFrame(gameLoop);
        }

        function updateFavicon() {
            // Draw the main canvas onto the small favicon canvas, scaling it down.
            // Disable image smoothing for a crisp, pixelated look.
            faviconCtx.imageSmoothingEnabled = false;
            faviconCtx.drawImage(canvas, 0, 0, 16, 16);
            // Update the link's href with the new image data.
            faviconLink.href = faviconCanvas.toDataURL('image/png');
        }

        const originalTitle = document.title;
        function updateTitle() {
            if (document.pointerLockElement !== canvas) {
                document.title = originalTitle;
            } else if (!gameRunning) {
                document.title = "WASD + Click Attack";
            } else {
                const health = Math.floor(player.health);
                const demons = sprites.filter(s => s.type === 1 && (s.state === 'alive' || s.state === 'dying')).length;
                const ammo = player.ammo;
                document.title = `❤️: ${health}% | 😈: ${demons} | 🔫: ${ammo}`;
            }
        }

        // --- Update Logic ---
        function update() {
            movePlayer();
            updateSprites();
            updateTitle();
        }
        
        function movePlayer() {
            const speed = player.moveSpeed;
            let moveX = 0;
            let moveY = 0;

            // Calculate combined movement vector for forward/backward
            if (keys['w'] || keys['arrowup']) {
                moveX += player.dirX * speed;
                moveY += player.dirY * speed;
            }
            if (keys['s'] || keys['arrowdown']) {
                moveX -= player.dirX * speed;
                moveY -= player.dirY * speed;
            }

            // Calculate combined movement vector for strafing
            if (keys['a'] || keys['arrowleft']) {
                moveX -= player.planeX * speed;
                moveY -= player.planeY * speed;
            }
            if (keys['d'] || keys['arrowright']) {
                moveX += player.planeX * speed;
                moveY += player.planeY * speed;
            }

            // Check for collision on X axis and move if clear
            if (moveX !== 0) {
                const newX = player.x + moveX;
                if (map[Math.floor(player.y)][Math.floor(newX)] === 0) {
                    player.x = newX;
                }
            }
            
            // Check for collision on Y axis and move if clear
            if (moveY !== 0) {
                const newY = player.y + moveY;
                // Use the potentially updated player.x for the check to allow sliding along walls correctly.
                if (map[Math.floor(newY)][Math.floor(player.x)] === 0) {
                    player.y = newY;
                }
            }
        }
        
        function rotatePlayer(dx) {
            let rotAmount = dx * 0.002; // Mouse sensitivity
            // Rotate direction vector
            let oldDirX = player.dirX;
            player.dirX = player.dirX * Math.cos(-rotAmount) - player.dirY * Math.sin(-rotAmount);
            player.dirY = oldDirX * Math.sin(-rotAmount) + player.dirY * Math.cos(-rotAmount);
            // Rotate camera plane
            let oldPlaneX = player.planeX;
            player.planeX = player.planeX * Math.cos(-rotAmount) - player.planeY * Math.sin(-rotAmount);
            player.planeY = oldPlaneX * Math.sin(-rotAmount) + player.planeY * Math.cos(-rotAmount);
        }

        function updateSprites() {
            sprites.forEach(sprite => {
                 if (sprite.state === 'dying') {
                    sprite.deathTimer--;
                    if (sprite.deathTimer <= 0) {
                        sprite.state = 'dead';
                        updateEnemiesLeft(); // Update count when fully dead
                    }
                    return; // Skip other logic
                 }

                 if (sprite.type === 1 && sprite.state === 'alive') {
                    const dist = Math.hypot(player.x - sprite.x, player.y - sprite.y);
                    if (dist < 1.0) { // Closer range for damage
                        player.health -= 0.5;
                        if (player.health < 0) player.health = 0;
                        healthUI.textContent = Math.floor(player.health);
                        if (player.health <= 0) {
                            endGame(false);
                        }
                    }
                 }
            });
        }

        // --- Rendering Logic ---
        function render() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw floor and ceiling
            ctx.fillStyle = '#2a1d1d'; // Ceiling
            ctx.fillRect(0, 0, canvas.width, canvas.height / 2);
            ctx.fillStyle = '#52463b'; // Floor
            ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);

            // Raycasting for walls
            for (let x = 0; x < internalResWidth; x++) {
                let cameraX = 2 * x / internalResWidth - 1;
                let rayDirX = player.dirX + player.planeX * cameraX;
                let rayDirY = player.dirY + player.planeY * cameraX;

                let mapX = Math.floor(player.x);
                let mapY = Math.floor(player.y);

                let sideDistX, sideDistY;
                let deltaDistX = Math.abs(1 / rayDirX);
                let deltaDistY = Math.abs(1 / rayDirY);
                let perpWallDist;

                let stepX, stepY;
                let hit = 0;
                let side;

                if (rayDirX < 0) {
                    stepX = -1;
                    sideDistX = (player.x - mapX) * deltaDistX;
                } else {
                    stepX = 1;
                    sideDistX = (mapX + 1.0 - player.x) * deltaDistX;
                }
                if (rayDirY < 0) {
                    stepY = -1;
                    sideDistY = (player.y - mapY) * deltaDistY;
                } else {
                    stepY = 1;
                    sideDistY = (mapY + 1.0 - player.y) * deltaDistY;
                }

                while (hit === 0) {
                    if (sideDistX < sideDistY) {
                        sideDistX += deltaDistX;
                        mapX += stepX;
                        side = 0;
                    } else {
                        sideDistY += deltaDistY;
                        mapY += stepY;
                        side = 1;
                    }
                    if (map[mapY][mapX] > 0) hit = 1;
                }

                if (side === 0) {
                    perpWallDist = (mapX - player.x + (1 - stepX) / 2) / rayDirX;
                } else {
                    perpWallDist = (mapY - player.y + (1 - stepY) / 2) / rayDirY;
                }

                let lineHeight = Math.floor(internalResHeight / perpWallDist);
                let drawStart = -lineHeight / 2 + internalResHeight / 2;
                if (drawStart < 0) drawStart = 0;
                let drawEnd = lineHeight / 2 + internalResHeight / 2;
                if (drawEnd >= internalResHeight) drawEnd = internalResHeight - 1;

                const wallType = map[mapY][mapX];
                const texture = textures[wallType];
                ctx.fillStyle = (side === 1) ? texture.shade : texture.color;
                
                const brightness = 1 - Math.min(perpWallDist / 10, 1);
                ctx.globalAlpha = brightness > 0 ? brightness : 0;
                
                ctx.fillRect(x * scale, drawStart * scale, scale, (drawEnd - drawStart + 1) * scale);
                ctx.globalAlpha = 1;
                
                zBuffer[x] = perpWallDist; // Store distance for sprite depth testing
            }
            
            // Render sprites
            renderSprites();
        }

        function renderSprites() {
             // Sort sprites from far to near
            sprites.sort((a, b) => {
                const distA = Math.pow(player.x - a.x, 2) + Math.pow(player.y - a.y, 2);
                const distB = Math.pow(player.x - b.x, 2) + Math.pow(player.y - b.y, 2);
                return distB - distA;
            });

            for (let i = 0; i < sprites.length; i++) {
                if(sprites[i].state === 'dead') continue;

                const spriteX = sprites[i].x - player.x;
                const spriteY = sprites[i].y - player.y;

                const invDet = 1.0 / (player.planeX * player.dirY - player.dirX * player.planeY);

                const transformX = invDet * (player.dirY * spriteX - player.dirX * spriteY);
                const transformY = invDet * (-player.planeY * spriteX + player.planeX * spriteY);

                if (transformY > 0) { // only draw if sprite is in front of player
                    const spriteScreenX = Math.floor((internalResWidth / 2) * (1 + transformX / transformY));
                    
                    let spriteHeight = Math.abs(Math.floor(internalResHeight / (transformY)));
                    let spriteWidth = Math.abs(Math.floor(internalResHeight / (transformY)));

                    if (sprites[i].state === 'dying') {
                        const shrinkFactor = sprites[i].deathTimer / 10;
                        spriteHeight *= shrinkFactor;
                        spriteWidth *= shrinkFactor;
                    }

                    const drawStartY = -spriteHeight / 2 + internalResHeight / 2;
                    let drawEndY = spriteHeight / 2 + internalResHeight / 2;
                    
                    const drawStartX = -spriteWidth / 2 + spriteScreenX;
                    const drawEndX = spriteWidth / 2 + spriteScreenX;
                    
                    let demonColors = spriteTextures[sprites[i].type];
                    let bodyColor = sprites[i].isHit ? '#FFFFFF' : demonColors.body;


                    for (let stripe = Math.floor(drawStartX); stripe < Math.ceil(drawEndX); stripe++) {
                        if (stripe >= 0 && stripe < internalResWidth && transformY < zBuffer[stripe]) {
                             // Main body (dark red)
                             ctx.fillStyle = bodyColor;
                             ctx.fillRect(stripe * scale, drawStartY * scale, scale, spriteHeight * scale);

                             // Body highlight (top-left corner for depth)
                             ctx.fillStyle = demonColors.highlight;
                             const highlightWidth = Math.max(1, Math.floor(scale * 0.3));
                             const highlightHeight = Math.floor(spriteHeight * 0.4);
                             ctx.fillRect(stripe * scale, drawStartY * scale, highlightWidth, highlightHeight * scale);

                             // Horns (curved horns on top)
                             ctx.fillStyle = demonColors.horn;
                             const hornHeight = spriteHeight * 0.2;
                             const hornY = drawStartY;
                             // Left horn (slightly curved)
                             ctx.fillRect(stripe * scale, hornY * scale, Math.floor(scale * 0.4), hornHeight * scale);
                             // Right horn
                             ctx.fillRect((stripe + 0.6) * scale, hornY * scale, Math.floor(scale * 0.4), hornHeight * scale);

                             // Eyes (two glowing orange eyes)
                             ctx.fillStyle = demonColors.eye;
                             const eyeHeight = spriteHeight * 0.12;
                             const leftEyeY = drawStartY + spriteHeight * 0.25;
                             const rightEyeY = drawStartY + spriteHeight * 0.35;

                             // Left eye
                             ctx.fillRect(stripe * scale, leftEyeY * scale, Math.floor(scale * 0.4), eyeHeight * scale);
                             // Right eye
                             ctx.fillRect((stripe + 0.6) * scale, rightEyeY * scale, Math.floor(scale * 0.4), eyeHeight * scale);

                             // Mouth (dark slit for menace)
                             ctx.fillStyle = '#000000';
                             const mouthY = drawStartY + spriteHeight * 0.6;
                             const mouthHeight = spriteHeight * 0.08;
                             ctx.fillRect(stripe * scale, mouthY * scale, scale, mouthHeight * scale);
                        }
                    }
                }
            }
        }

        function shoot() {
            if (player.ammo <= 0) return; // No ammo
            
            player.ammo--;
            ammoUI.textContent = player.ammo;
            
            // Simple hitscan: Check which sprite is in the center of the screen
            const centerX = internalResWidth / 2;
            let hitSprite = null;
            let closestDist = Infinity;
            
            sprites.forEach(sprite => {
                if (sprite.state !== 'alive') return;

                const spriteX = sprite.x - player.x;
                const spriteY = sprite.y - player.y;
                const invDet = 1.0 / (player.planeX * player.dirY - player.dirX * player.planeY);
                const transformX = invDet * (player.dirY * spriteX - player.dirX * spriteY);
                const transformY = invDet * (-player.planeY * spriteX + player.planeX * spriteY);
                
                if (transformY > 0) { // only check if sprite is in front of player
                    const spriteScreenX = Math.floor((internalResWidth / 2) * (1 + transformX / transformY));
                    const spriteWidth = Math.abs(Math.floor(internalResHeight / transformY));

                    if (Math.abs(spriteScreenX - centerX) < spriteWidth / 2 && transformY < zBuffer[Math.floor(centerX)]) {
                       if (transformY < closestDist) {
                            closestDist = transformY;
                            hitSprite = sprite;
                       }
                    }
                }
            });

            if (hitSprite) {
                hitSprite.health -= 50; // Damage the demon
                hitSprite.isHit = true; // Trigger flash effect
                setTimeout(() => { hitSprite.isHit = false; }, 100);

                if (hitSprite.health <= 0) {
                    hitSprite.state = 'dying';
                    hitSprite.deathTimer = 10; // Frames for death animation
                }
            }
        }
        
        function updateEnemiesLeft() {
             const aliveEnemies = sprites.filter(s => s.type === 1 && (s.state === 'alive' || s.state === 'dying')).length;
             enemiesLeftUI.textContent = aliveEnemies;
             if (aliveEnemies === 0) {
                endGame(true); // Player wins
             }
        }

        // --- Game Flow & UI ---
        function startGame() {
            player.x = 1.5;
            player.y = 1.5;
            player.health = 100;
            player.ammo = 50;
            player.dirX = 1;
            player.dirY = 0;
            player.planeX = 0;
            player.planeY = -0.66;
            
            sprites.forEach(s => {
                s.state = 'alive';
                if (s.type === 1) s.health = 100;
            });

            healthUI.textContent = player.health;
            ammoUI.textContent = player.ammo;
            updateEnemiesLeft();
            updateTitle();

            overlay.style.display = 'none';
            canvas.requestPointerLock();
            gameRunning = true;
        }

        function endGame(isWin) {
            gameRunning = false;
            document.exitPointerLock();
            if (document.pointerLockElement === canvas) {
                document.title = isWin ? "YOU WIN!" : "GAME OVER";
            }
        }

        // --- Event Listeners ---
        window.addEventListener('keydown', (e) => keys[e.key.toLowerCase()] = true);
        window.addEventListener('keyup', (e) => keys[e.key.toLowerCase()] = false);

        // Click anywhere to start game or shoot

        const startDoomBtn = document.getElementById('startDoomBtn');
        if (startDoomBtn) {
            startDoomBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!gameRunning) {
                    startGame();
                }
            });
        }
        
        document.addEventListener('click', (e) => {
            if (gameRunning && document.pointerLockElement === canvas) {
                shoot();
            }
        });
    

        canvas.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent double triggering
            if(gameRunning) {
                shoot();
            } else {
                canvas.requestPointerLock();
            }
        });
        
        document.addEventListener('pointerlockchange', () => {
            if (document.pointerLockElement !== canvas) {
                // Pause game if pointer lock is lost, unless the game is already over
                if(gameRunning) {
                   // This could be a pause menu in a full game
                }
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (document.pointerLockElement === canvas) {
                rotatePlayer(e.movementX);
            }
        });

        startButton.addEventListener('click', startGame);

        // Initial setup
        updateEnemiesLeft();
        updateTitle(); 
        
        // Start running the background simulation
        gameRunning = true;
        gameLoop();
    });