const state = {
    simulation: 'firstLaw',
    isRunning: false,
    velocity: 1,
    direction: 1, // 1 for right, -1 for left
    mass: 50,
    force: 100,
    friction: 0.1,
    mass1: 50,
    mass2: 50,
    velocity1: 1,
    velocity2: -1,
    showVectors: true,
    draggingObject: false,
    animationTime: 0,
    position: 100,
    position2: 300,
    acceleration: 0
};

const config = {
    canvas: { maxWidth: 800, maxHeight: 600, aspectRatio: 4 / 3 },
    simulations: {
        firstLaw: {
            description: 'Cismə xalis qüvvə təsir etmədikdə onun sabit sürətlə düzxətli hərəkətini müşahidə edin.',
            controls: `
                <label data-tooltip="Cismin sürətini tənzimləyin">Sürət (m/s): <input type="range" id="velocitySlider" min="0" max="3" step="0.1" value="1" aria-label="Cismin sürəti"></label>
                <label data-tooltip="Hərəkət istiqaməti">İstiqamət: <select id="directionSelect" aria-label="Hərəkət istiqaməti">
                    <option value="1">Sağa</option>
                    <option value="-1">Sola</option>
                </select></label>
                <label data-tooltip="Vektorları göstər">Vektorlar: <input type="checkbox" id="showVectors" checked aria-label="Vektorların görünməsi"></label>
            `
        },
        secondLaw: {
            description: 'Qüvvə, kütlə və təcil arasındakı əlaqəni kəşf edin: F = m·a.',
            controls: `
                <label data-tooltip="Cismin kütləsini tənzimləyin">Kütlə (kg): <input type="range" id="massSlider" min="10" max="100" value="50" aria-label="Cismin kütləsi"></label>
                <label data-tooltip="Təsir edən qüvvəni dəyişdirin">Qüvvə (N): <input type="range" id="forceSlider" min="0" max="200" value="100" aria-label="Təsir qüvvəsi"></label>
                <label data-tooltip="Sürtünmə əmsalını tənzimləyin">Sürtünmə: <input type="range" id="frictionSlider" min="0" max="0.5" step="0.01" value="0.1" aria-label="Sürtünmə əmsalı"></label>
                <label data-tooltip="Hərəkət istiqaməti">İstiqamət: <select id="directionSelect" aria-label="Hərəkət istiqaməti">
                    <option value="1">Sağa</option>
                    <option value="-1">Sola</option>
                </select></label>
                <label data-tooltip="Vektorları göstər">Vektorlar: <input type="checkbox" id="showVectors" checked aria-label="Vektorların görünməsi"></label>
            `
        },
        thirdLaw: {
            description: 'Təsir və qarşılıqlı təsir qüvvələrinin bərabərliyini və əks istiqamətlərini görün.',
            controls: `
                <label data-tooltip="Birinci cismin kütləsini tənzimləyin">Kütlə 1 (kg): <input type="range" id="mass1Slider" min="10" max="100" value="50" aria-label="Birinci cismin kütləsi"></label>
                <label data-tooltip="İkinci cismin kütləsini tənzimləyin">Kütlə 2 (kg): <input type="range" id="mass2Slider" min="10" max="100" value="50" aria-label="İkinci cismin kütləsi"></label>
                <label data-tooltip="Vektorları göstər">Vektorlar: <input type="checkbox" id="showVectors" checked aria-label="Vektorların görünməsi"></label>
            `
        }
    }
};

function selectSimulation(sim) {
    state.simulation = sim;
    state.isRunning = false;
    state.animationTime = 0;
    state.position = 100;
    state.position2 = 300;
    state.velocity = 1;
    state.velocity1 = 1;
    state.velocity2 = -1;
    state.direction = 1;
    state.acceleration = 0;
    document.getElementById('playPause').textContent = 'Başlat';
    document.getElementById('playPause').classList.remove('running');
    document.querySelectorAll('.sim-button').forEach(btn => {
        btn.classList.toggle('active', btn.textContent.toLowerCase().startsWith(sim.replace('Law', '')));
    });
    document.getElementById('simulationDescription').textContent = config.simulations[sim].description;
    document.getElementById('controls').innerHTML = config.simulations[sim].controls;
    updateControlValues();
}

function navigateToSimulation(sim) {
    document.querySelectorAll('.tab').forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
    });
    const homeTab = document.querySelector('.tab[data-section="home"]');
    homeTab.classList.add('active');
    homeTab.setAttribute('aria-selected', 'true');

    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById('home').classList.add('active');

    selectSimulation(sim);

    document.getElementById('home').scrollIntoView({ behavior: 'smooth' });

    if (window.innerWidth <= 768) {
        document.querySelector('.sidebar').classList.add('hidden');
    }
}

function toggleAnimation() {
    state.isRunning = !state.isRunning;
    document.getElementById('playPause').textContent = state.isRunning ? 'Dayandır' : 'Başlat';
    document.getElementById('playPause').classList.toggle('running', state.isRunning);
}

function resetSimulation() {
    Object.assign(state, {
        velocity: 1,
        direction: 1,
        mass: 50,
        force: 100,
        friction: 0.1,
        mass1: 50,
        mass2: 50,
        velocity1: 1,
        velocity2: -1,
        showVectors: true,
        draggingObject: false,
        animationTime: 0,
        position: 100,
        position2: 300,
        acceleration: 0
    });
    selectSimulation(state.simulation);
}

function updateControlValues() {
    if (document.getElementById('velocitySlider')) {
        document.getElementById('velocitySlider').value = state.velocity;
    }
    if (document.getElementById('directionSelect')) {
        document.getElementById('directionSelect').value = state.direction;
    }
    if (document.getElementById('massSlider')) {
        document.getElementById('massSlider').value = state.mass;
    }
    if (document.getElementById('forceSlider')) {
        document.getElementById('forceSlider').value = state.force;
    }
    if (document.getElementById('frictionSlider')) {
        document.getElementById('frictionSlider').value = state.friction;
    }
    if (document.getElementById('mass1Slider')) {
        document.getElementById('mass1Slider').value = state.mass1;
    }
    if (document.getElementById('mass2Slider')) {
        document.getElementById('mass2Slider').value = state.mass2;
    }
    if (document.getElementById('showVectors')) {
        document.getElementById('showVectors').checked = state.showVectors;
    }
}

function setup() {
    let width = Math.min(window.innerWidth - 40, config.canvas.maxWidth);
    let height = width / config.canvas.aspectRatio;
    if (height > config.canvas.maxHeight) {
        height = config.canvas.maxHeight;
        width = height * config.canvas.aspectRatio;
    }
    createCanvas(width, height).parent('simulationCanvas');
    textAlign(CENTER);
    textSize(14);
    selectSimulation('firstLaw');
}

function mousePressed() {
    if (state.simulation === 'firstLaw' || state.simulation === 'secondLaw') {
        const objX = state.position;
        const objY = height - 50;
        if (dist(mouseX, mouseY, objX, objY) < 30) {
            state.draggingObject = true;
        }
    }
}

function mouseReleased() {
    state.draggingObject = false;
}

function touchStarted() {
    mousePressed();
    return false;
}

function touchEnded() {
    mouseReleased();
    return false;
}

function draw() {
    background(230, 240, 255);

    if (state.draggingObject && (state.simulation === 'firstLaw' || state.simulation === 'secondLaw')) {
        state.position = constrain(mouseX, 50, width - 50);
        state.velocity = 0;
        state.acceleration = 0;
    }

    if (state.isRunning) {
        state.animationTime += 0.016; // Approx 60fps
    }

    if (state.simulation === 'firstLaw') drawFirstLaw();
    else if (state.simulation === 'secondLaw') drawSecondLaw();
    else if (state.simulation === 'thirdLaw') drawThirdLaw();
}

function drawFirstLaw() {
    const groundY = height - 50;
    state.velocity = Number(document.getElementById('velocitySlider')?.value || state.velocity);
    state.direction = Number(document.getElementById('directionSelect')?.value || state.direction);
    state.showVectors = document.getElementById('showVectors')?.checked ?? state.showVectors;

    // Ground
    fill(100, 200, 100);
    rect(0, groundY, width, 50);

    // Object
    let objX = state.position;
    if (state.isRunning && !state.draggingObject) {
        objX += state.velocity * state.direction * 5;
        objX = constrain(objX, 30, width - 30);
        if (objX >= width - 30 || objX <= 30) {
            state.direction = -state.direction;
            if (document.getElementById('directionSelect')) {
                document.getElementById('directionSelect').value = state.direction;
            }
        }
        state.position = objX;
    }
    fill(255, 100, 100);
    rect(objX - 30, groundY - 60, 60, 60, 10);

    // Vectors
    if (state.showVectors) {
        stroke(0, 0, 255);
        strokeWeight(2);
        const vectorLength = state.velocity * state.direction * 20;
        line(objX, groundY - 30, objX + vectorLength, groundY - 30);
        fill(0, 0, 255);
        triangle(
            objX + vectorLength, groundY - 30,
            objX + vectorLength - (vectorLength >= 0 ? 10 : -10), groundY - 40,
            objX + vectorLength - (vectorLength >= 0 ? 10 : -10), groundY - 20
        );
        noStroke();
        fill(0);
        text(`Sürət: ${Math.abs(state.velocity).toFixed(1)} m/s`, width / 2, 30);
        text(`Xalis qüvvə: 0 N`, width / 2, 50);
    }
}

function drawSecondLaw() {
    const groundY = height - 50;
    state.mass = Number(document.getElementById('massSlider')?.value || state.mass);
    state.force = Number(document.getElementById('forceSlider')?.value || state.force);
    state.friction = Number(document.getElementById('frictionSlider')?.value || state.friction);
    state.direction = Number(document.getElementById('directionSelect')?.value || state.direction);
    state.showVectors = document.getElementById('showVectors')?.checked ?? state.showVectors;

    // Ground
    fill(100, 200, 100);
    rect(0, groundY, width, 50);

    // Object
    let objX = state.position;
    if (state.isRunning && !state.draggingObject) {
        const frictionForce = state.friction * state.mass * 9.81;
        const netForce = (state.force * state.direction) - (state.velocity >= 0 ? frictionForce : -frictionForce);
        state.acceleration = netForce / state.mass;
        state.velocity += state.acceleration * 0.016;
        objX += state.velocity * 5;
        objX = constrain(objX, 30, width - 30);
        if (objX >= width - 30 || objX <= 30) {
            state.velocity = -state.velocity * 0.8;
            state.direction = state.velocity >= 0 ? 1 : -1;
            if (document.getElementById('directionSelect')) {
                document.getElementById('directionSelect').value = state.direction;
            }
        }
        state.position = objX;
    }
    fill(255, 100, 100);
    rect(objX - 30, groundY - 60, 60, 60, 10);

    // Vectors
    if (state.showVectors) {
        const frictionForce = state.friction * state.mass * 9.81;
        stroke(0, 0, 255);
        strokeWeight(2);
        const forceVector = state.force * state.direction / 5;
        line(objX, groundY - 30, objX + forceVector, groundY - 30);
        fill(0, 0, 255);
        triangle(
            objX + forceVector, groundY - 30,
            objX + forceVector - (forceVector >= 0 ? 10 : -10), groundY - 40,
            objX + forceVector - (forceVector >= 0 ? 10 : -10), groundY - 20
        );
        stroke(255, 0, 0);
        line(objX, groundY - 30, objX - frictionForce / 5, groundY - 30);
        fill(255, 0, 0);
        triangle(
            objX - frictionForce / 5, groundY - 30,
            objX - frictionForce / 5 + 10, groundY - 40,
            objX - frictionForce / 5 + 10, groundY - 20
        );
        noStroke();
        fill(0);
        text(`Qüvvə: ${state.force.toFixed(0)} N`, width / 2, 30);
        text(`Sürtünmə: ${frictionForce.toFixed(0)} N`, width / 2, 50);
        text(`Kütlə: ${state.mass.toFixed(0)} kg`, width / 2, 70);
        text(`Təcil: ${state.acceleration.toFixed(2)} m/s²`, width / 2, 90);
    }
}

function drawThirdLaw() {
    const groundY = height - 50;
    state.mass1 = Number(document.getElementById('mass1Slider')?.value || state.mass1);
    state.mass2 = Number(document.getElementById('mass2Slider')?.value || state.mass2);
    state.showVectors = document.getElementById('showVectors')?.checked ?? state.showVectors;

    // Ground
    fill(100, 200, 100);
    rect(0, groundY, width, 50);

    // Objects
    let obj1X = state.position;
    let obj2X = state.position2;
    if (state.isRunning) {
        // Update positions
        obj1X += state.velocity1 * 5;
        obj2X += state.velocity2 * 5;

        // Collision detection
        const obj1Right = obj1X + 40;
        const obj2Left = obj2X - 40;
        if (obj1Right >= obj2Left && state.velocity1 > state.velocity2) {
            // Elastic collision
            const m1 = state.mass1;
            const m2 = state.mass2;
            const u1 = state.velocity1;
            const u2 = state.velocity2;

            state.velocity1 = ((m1 - m2) * u1 + 2 * m2 * u2) / (m1 + m2);
            state.velocity2 = ((m2 - m1) * u2 + 2 * m1 * u1) / (m1 + m2);

            // Adjust positions to prevent overlap
            const overlap = obj1Right - obj2Left;
            obj1X -= overlap / 2;
            obj2X += overlap / 2;
        }

        // Constrain within canvas
        obj1X = constrain(obj1X, 40, width - 120);
        obj2X = constrain(obj2X, 120, width - 40);

        // Reverse direction at boundaries
        if (obj1X <= 40 || obj1X >= width - 120) {
            state.velocity1 = -state.velocity1;
        }
        if (obj2X <= 120 || obj2X >= width - 40) {
            state.velocity2 = -state.velocity2;
        }

        state.position = obj1X;
        state.position2 = obj2X;
    }

    // Draw objects
    fill(255, 100, 100);
    rect(obj1X - 40, groundY - 60, 80, 60, 10);
    fill(100, 100, 255);
    rect(obj2X - 40, groundY - 60, 80, 60, 10);

    // Vectors
    if (state.showVectors) {
        const force = Math.abs(state.mass1 * (state.velocity1 / 0.016));
        stroke(0, 0, 255);
        strokeWeight(2);
        const forceVector1 = state.velocity1 * 20;
        line(obj1X, groundY - 30, obj1X + forceVector1, groundY - 30);
        fill(0, 0, 255);
        triangle(
            obj1X + forceVector1, groundY - 30,
            obj1X + forceVector1 - (forceVector1 >= 0 ? 10 : -10), groundY - 40,
            obj1X + forceVector1 - (forceVector1 >= 0 ? 10 : -10), groundY - 20
        );
        stroke(255, 0, 0);
        const forceVector2 = state.velocity2 * 20;
        line(obj2X, groundY - 30, obj2X + forceVector2, groundY - 30);
        fill(255, 0, 0);
        triangle(
            obj2X + forceVector2, groundY - 30,
            obj2X + forceVector2 - (forceVector2 >= 0 ? 10 : -10), groundY - 40,
            obj2X + forceVector2 - (forceVector2 >= 0 ? 10 : -10), groundY - 20
        );
        noStroke();
        fill(0);
        text(`Təsir qüvvəsi: ${force.toFixed(0)} N`, width / 2 - 100, 30);
        text(`Qarşılıqlı təsir: ${force.toFixed(0)} N`, width / 2 + 100, 30);
        text(`Kütlə 1: ${state.mass1.toFixed(0)} kg`, width / 2 - 100, 50);
        text(`Kütlə 2: ${state.mass2.toFixed(0)} kg`, width / 2 + 100, 50);
        text(`Sürət 1: ${Math.abs(state.velocity1).toFixed(2)} m/s`, width / 2 - 100, 70);
        text(`Sürət 2: ${Math.abs(state.velocity2).toFixed(2)} m/s`, width / 2 + 100, 70);
    }
}

function initEventListeners() {
    document.getElementById('themeToggle').addEventListener('click', () => {
        document.body.dataset.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
        document.getElementById('themeToggle').innerHTML = document.body.dataset.theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });

    document.querySelector('.hamburger').addEventListener('click', () => {
        document.querySelector('.sidebar').classList.toggle('hidden');
    });

    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');

            document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
            const section = document.getElementById(tab.dataset.section);
            section.classList.add('active');
            section.scrollIntoView({ behavior: 'smooth' });

            if (window.innerWidth <= 768) {
                document.querySelector('.sidebar').classList.add('hidden');
            }
        });
    });
}

initEventListeners();