
// ── Clase Base─────────────────────────────────
class Coffee {
  constructor(name, price) {
    this._name = name;
    this._price = price;
  }
  getName() { return this._name; }
  getPrice() { return this._price; }
  getDescription() {
    return `${this._name} — $${this._price.toFixed(2)}`;
  }
}

// ── Decorador Base ───────────────────────────────────────────
class CoffeeDecorator {
  constructor(coffee) {
    this._coffee = coffee;
  }
  getName() { return this._coffee.getName(); }
  getPrice() { return this._coffee.getPrice(); }
  getDescription() { return this._coffee.getDescription(); }
}

// ── Decoradores Concretos ────────────────────────────────────

class OatMilkDecorator extends CoffeeDecorator {
  getName() { return `${this._coffee.getName()} + Oat Milk`; }
  getPrice() { return this._coffee.getPrice() + 0.75; }
  getDescription() {
    return `${this._coffee.getDescription()}\n  + Oat Milk           +$0.75`;
  }
}

class AlmondMilkDecorator extends CoffeeDecorator {
  getName() { return `${this._coffee.getName()} + Almond Milk`; }
  getPrice() { return this._coffee.getPrice() + 0.65; }
  getDescription() {
    return `${this._coffee.getDescription()}\n  + Almond Milk        +$0.65`;
  }
}

class ExtraShotDecorator extends CoffeeDecorator {
  getName() { return `${this._coffee.getName()} + Extra Shot`; }
  getPrice() { return this._coffee.getPrice() + 0.75; }
  getDescription() {
    return `${this._coffee.getDescription()}\n  + Extra Shot         +$0.75`;
  }
}

class BrownSugarSyrupDecorator extends CoffeeDecorator {
  getName() { return `${this._coffee.getName()} + Brown Sugar Syrup`; }
  getPrice() { return this._coffee.getPrice() + 0.60; }
  getDescription() {
    return `${this._coffee.getDescription()}\n  + Brown Sugar Syrup  +$0.60`;
  }
}

class VanillaSyrupDecorator extends CoffeeDecorator {
  getName() { return `${this._coffee.getName()} + Vanilla Syrup`; }
  getPrice() { return this._coffee.getPrice() + 0.50; }
  getDescription() {
    return `${this._coffee.getDescription()}\n  + Vanilla Syrup      +$0.50`;
  }
}

class CinnamonDecorator extends CoffeeDecorator {
  getName() { return `${this._coffee.getName()} + Cinnamon`; }
  getPrice() { return this._coffee.getPrice() + 0.25; }
  getDescription() {
    return `${this._coffee.getDescription()}\n  + Cinnamon           +$0.25`;
  }
}

class IceDecorator extends CoffeeDecorator {
  getName() { return `${this._coffee.getName()} (Iced)`; }
  getPrice() { return this._coffee.getPrice() + 0.30; }
  getDescription() {
    return `${this._coffee.getDescription()}\n  + Iced               +$0.30`;
  }
}

class DecafDecorator extends CoffeeDecorator {
  getName() { return `${this._coffee.getName()} (Decaf)`; }
  getPrice() { return this._coffee.getPrice() + 0.40; }
  getDescription() {
    return `${this._coffee.getDescription()}\n  + Decaf              +$0.40`;
  }
}

// ── Registro de decoradores disponibles ─────────────────────
const DECORATORS = {
  'oat-milk': { Class: OatMilkDecorator, label: 'Oat Milk', price: 0.75, emoji: '🌾' },
  'almond-milk': { Class: AlmondMilkDecorator, label: 'Almond Milk', price: 0.65, emoji: '🥛' },
  'extra-shot': { Class: ExtraShotDecorator, label: 'Extra Shot', price: 0.75, emoji: '⚡' },
  'brown-sugar-syrup': { Class: BrownSugarSyrupDecorator, label: 'Brown Sugar Syrup', price: 0.60, emoji: '🍬' },
  'vanilla-syrup': { Class: VanillaSyrupDecorator, label: 'Vanilla Syrup', price: 0.50, emoji: '🌸' },
  'cinnamon': { Class: CinnamonDecorator, label: 'Cinnamon', price: 0.25, emoji: '🍂' },
  'iced': { Class: IceDecorator, label: 'Iced', price: 0.30, emoji: '🧊' },
  'decaf': { Class: DecafDecorator, label: 'Decaf', price: 0.40, emoji: '😌' },
};

// ── Cafés base disponibles ───────────────────────────────────
const BASE_COFFEES = {
  'double-shot': new Coffee('Double Shot', 3.50),
  'flat-white': new Coffee('Flat White', 5.00),
  'brown-sugar-latte': new Coffee('Brown Sugar Latte', 5.75),
  'pour-over': new Coffee('Pour Over', 4.25),
  'cold-brew': new Coffee('Cold Brew', 5.50),
  'matcha-latte': new Coffee('Matcha Latte', 4.75),
};

// ── Estado del customizador ──────────────────────────────────
let selectedBase = 'flat-white';
let activeDecorators = new Set();
let decoratorStack = []; // pila de capas aplicadas (para visualización)

// ── Construye el objeto decorado según el estado actual ──────
function buildCoffee() {
  let coffee = Object.assign(
    Object.create(Object.getPrototypeOf(BASE_COFFEES[selectedBase])),
    BASE_COFFEES[selectedBase]
  );
  // Recrea la instancia base limpia
  coffee = new Coffee(
    BASE_COFFEES[selectedBase]._name,
    BASE_COFFEES[selectedBase]._price
  );

  activeDecorators.forEach(key => {
    const { Class } = DECORATORS[key];
    coffee = new Class(coffee);  // ← envolvemos: patrón Decorador
  });

  return coffee;
}

// ── UI: actualiza el panel de precio en tiempo real ──────────
function updateDisplay() {
  const coffee = buildCoffee();

  document.getElementById('cc-drink-name').textContent =
    coffee.getName();

  document.getElementById('cc-total-price').textContent =
    `$${coffee.getPrice().toFixed(2)}`;

  // Reconstruye la pila de capas (stacktrace visual del decorador)
  const stackEl = document.getElementById('cc-stack');
  stackEl.innerHTML = '';

  // Base
  const baseItem = document.createElement('div');
  baseItem.className = 'cc-stack-item cc-stack-base';
  baseItem.innerHTML = `
    <span class="cc-stack-layer">Base</span>
    <span class="cc-stack-name">${BASE_COFFEES[selectedBase]._name}</span>
    <span class="cc-stack-price">$${BASE_COFFEES[selectedBase]._price.toFixed(2)}</span>
  `;
  stackEl.appendChild(baseItem);

  // Decoradores activos
  activeDecorators.forEach(key => {
    const d = DECORATORS[key];
    const item = document.createElement('div');
    item.className = 'cc-stack-item cc-stack-decorator';
    item.innerHTML = `
      <span class="cc-stack-layer">${d.emoji} Decorator</span>
      <span class="cc-stack-name">${d.label}</span>
      <span class="cc-stack-price">+$${d.price.toFixed(2)}</span>
    `;
    stackEl.appendChild(item);
  });

  // Total
  const totalItem = document.createElement('div');
  totalItem.className = 'cc-stack-item cc-stack-total';
  totalItem.innerHTML = `
    <span class="cc-stack-layer">Total</span>
    <span class="cc-stack-name">${coffee.getName()}</span>
    <span class="cc-stack-price">$${coffee.getPrice().toFixed(2)}</span>
  `;
  stackEl.appendChild(totalItem);
}

// ── UI: seleccionar café base ────────────────────────────────
function selectBase(key) {
  selectedBase = key;
  document.querySelectorAll('.cc-base-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.key === key);
  });
  updateDisplay();
}

// ── UI: toggle de un decorador ───────────────────────────────
function toggleDecorator(key) {
  const btn = document.querySelector(`.cc-deco-btn[data-key="${key}"]`);
  if (activeDecorators.has(key)) {
    activeDecorators.delete(key);
    btn.classList.remove('active');
  } else {
    activeDecorators.add(key);
    btn.classList.add('active');
  }
  updateDisplay();
}

// ── UI: reset ────────────────────────────────────────────────
function resetCustomizer() {
  activeDecorators.clear();
  document.querySelectorAll('.cc-deco-btn').forEach(b => b.classList.remove('active'));
  updateDisplay();
}

// ── Inyecta el widget en el DOM ──────────────────────────────
function initCoffeeCustomizer() {
  const section = document.createElement('section');
  section.className = 'cc-section';
  section.id = 'customize';

  section.innerHTML = `
    <div class="container">
      <span class="label">Build Your Cup</span>
      <h2>Customize your order</h2>
      <div class="divider"></div>
      <p class="cc-intro">Each add-on wraps your drink with a new layer — that's the Decorator Pattern in action.</p>

      <div class="cc-layout">

        <!-- Left: selector de base + decoradores -->
        <div class="cc-controls">
          <h4 class="cc-section-title">1. Choose your base</h4>
          <div class="cc-base-grid" id="cc-base-grid"></div>

          <h4 class="cc-section-title" style="margin-top:2rem;">2. Add your extras</h4>
          <div class="cc-deco-grid" id="cc-deco-grid"></div>

          <button class="btn btn-outline cc-reset-btn" onclick="resetCustomizer()">Reset</button>
        </div>

        <!-- Right: visualización del stack del decorador -->
        <div class="cc-preview">
          <div class="cc-drink-display">
            <div class="cc-cup-icon">☕</div>
            <div class="cc-drink-name" id="cc-drink-name">Flat White</div>
            <div class="cc-total-price" id="cc-total-price">$5.00</div>
          </div>

          <div class="cc-stack-label">Decorator stack</div>
          <div class="cc-stack" id="cc-stack"></div>

          <button class="btn btn-primary cc-order-btn" onclick="handleOrder()">Add to Order</button>
        </div>

      </div>
    </div>
  `;

  // Inserta antes de #signup
  const signupSection = document.getElementById('signup');
  signupSection.parentNode.insertBefore(section, signupSection);

  // Genera los botones de café base
  const baseGrid = document.getElementById('cc-base-grid');
  Object.entries(BASE_COFFEES).forEach(([key, coffee]) => {
    const btn = document.createElement('button');
    btn.className = 'cc-base-btn' + (key === selectedBase ? ' active' : '');
    btn.dataset.key = key;
    btn.innerHTML = `
      <span class="cc-base-name">${coffee._name}</span>
      <span class="cc-base-price">$${coffee._price.toFixed(2)}</span>
    `;
    btn.addEventListener('click', () => selectBase(key));
    baseGrid.appendChild(btn);
  });

  // Genera los botones de decoradores
  const decoGrid = document.getElementById('cc-deco-grid');
  Object.entries(DECORATORS).forEach(([key, deco]) => {
    const btn = document.createElement('button');
    btn.className = 'cc-deco-btn';
    btn.dataset.key = key;
    btn.innerHTML = `
      <span class="cc-deco-emoji">${deco.emoji}</span>
      <span class="cc-deco-label">${deco.label}</span>
      <span class="cc-deco-price">+$${deco.price.toFixed(2)}</span>
    `;
    btn.addEventListener('click', () => toggleDecorator(key));
    decoGrid.appendChild(btn);
  });

  updateDisplay();
}

// ── Simulación de "agregar al pedido" ────────────────────────
function handleOrder() {
  const coffee = buildCoffee();
  const confirmation = document.createElement('div');
  confirmation.className = 'cc-order-toast';
  confirmation.innerHTML = `
    <span>✓</span>
    <span>${coffee.getName()} added — $${coffee.getPrice().toFixed(2)}</span>
  `;
  document.body.appendChild(confirmation);
  setTimeout(() => confirmation.classList.add('show'), 10);
  setTimeout(() => {
    confirmation.classList.remove('show');
    setTimeout(() => confirmation.remove(), 400);
  }, 3000);
}

// ── Agrega estilos del widget ────────────────────────────────
function injectStyles() {
  const style = document.createElement('style');
  style.textContent = `
    /* ── Sección Customizer ──────────────────────────── */
    .cc-section {
      background: var(--cream);
      padding: 6rem 5%;
    }

    .cc-intro {
      max-width: 500px;
      margin: 0 auto 3rem;
      color: var(--text-muted);
    }

    .cc-layout {
      display: grid;
      grid-template-columns: 1.1fr 1fr;
      gap: 3rem;
      align-items: start;
      text-align: left;
      margin-top: 2rem;
    }

    .cc-section-title {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.72rem;
      font-weight: 500;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--caramel);
      margin-bottom: 1rem;
    }

    /* ── Base buttons ───────────────────────────────── */
    .cc-base-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.6rem;
    }

    .cc-base-btn {
      background: #fff;
      border: 1.5px solid rgba(122, 74, 44, 0.12);
      border-radius: 10px;
      padding: 0.75rem 1rem;
      cursor: pointer;
      text-align: left;
      transition: all 0.2s;
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }

    .cc-base-btn:hover {
      border-color: var(--caramel);
      transform: translateY(-1px);
    }

    .cc-base-btn.active {
      border-color: var(--caramel);
      background: rgba(200, 137, 74, 0.07);
    }

    .cc-base-name {
      font-size: 0.85rem;
      color: var(--espresso);
      font-weight: 500;
    }

    .cc-base-price {
      font-size: 0.78rem;
      color: var(--caramel);
      font-family: 'Playfair Display', serif;
    }

    /* ── Decorator buttons ──────────────────────────── */
    .cc-deco-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .cc-deco-btn {
      background: #fff;
      border: 1.5px solid rgba(122, 74, 44, 0.12);
      border-radius: 2rem;
      padding: 0.5rem 1rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      transition: all 0.2s;
      font-family: 'DM Sans', sans-serif;
    }

    .cc-deco-btn:hover {
      border-color: var(--caramel);
      transform: translateY(-1px);
    }

    .cc-deco-btn.active {
      background: var(--espresso);
      border-color: var(--espresso);
      color: var(--foam);
    }

    .cc-deco-emoji { font-size: 0.95rem; }

    .cc-deco-label {
      font-size: 0.82rem;
      font-weight: 500;
      color: var(--espresso);
    }

    .cc-deco-btn.active .cc-deco-label {
      color: var(--foam);
    }

    .cc-deco-price {
      font-size: 0.75rem;
      color: var(--caramel);
    }

    .cc-deco-btn.active .cc-deco-price {
      color: rgba(232, 221, 208, 0.7);
    }

    .cc-reset-btn {
      margin-top: 1.5rem;
      font-size: 0.78rem;
      padding: 0.6rem 1.5rem;
    }

    /* ── Preview panel ──────────────────────────────── */
    .cc-preview {
      position: sticky;
      top: 100px;
    }

    .cc-drink-display {
      background: var(--espresso);
      border-radius: 20px;
      padding: 2rem;
      text-align: center;
      margin-bottom: 1.25rem;
    }

    .cc-cup-icon {
      font-size: 2.8rem;
      margin-bottom: 0.75rem;
      animation: floatCup 3s ease-in-out infinite;
    }

    @keyframes floatCup {
      0%, 100% { transform: translateY(0); }
      50%       { transform: translateY(-6px); }
    }

    .cc-drink-name {
      font-family: 'Playfair Display', serif;
      font-size: 1.05rem;
      color: var(--foam);
      line-height: 1.4;
      margin-bottom: 0.75rem;
      min-height: 2.8rem;
      transition: all 0.3s;
    }

    .cc-total-price {
      font-family: 'Playfair Display', serif;
      font-size: 2.2rem;
      color: var(--caramel);
      font-weight: 700;
      transition: all 0.3s;
    }

    /* ── Stack visual ───────────────────────────────── */
    .cc-stack-label {
      font-size: 0.68rem;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--text-muted);
      margin-bottom: 0.6rem;
    }

    .cc-stack {
      display: flex;
      flex-direction: column;
      gap: 3px;
      margin-bottom: 1.5rem;
    }

    .cc-stack-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.55rem 0.9rem;
      border-radius: 8px;
      font-size: 0.83rem;
      animation: stackSlide 0.25s ease both;
    }

    @keyframes stackSlide {
      from { opacity: 0; transform: translateX(-8px); }
      to   { opacity: 1; transform: translateX(0); }
    }

    .cc-stack-base {
      background: rgba(44, 26, 14, 0.07);
      border-left: 3px solid var(--roast);
    }

    .cc-stack-decorator {
      background: rgba(200, 137, 74, 0.08);
      border-left: 3px solid var(--caramel);
      margin-left: 0.75rem;
    }

    .cc-stack-total {
      background: var(--espresso);
      color: var(--foam);
      border-left: 3px solid var(--caramel);
      font-weight: 500;
    }

    .cc-stack-layer {
      font-size: 0.68rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--text-muted);
      width: 80px;
      flex-shrink: 0;
    }

    .cc-stack-total .cc-stack-layer {
      color: rgba(232, 221, 208, 0.5);
    }

    .cc-stack-name {
      flex: 1;
      color: var(--espresso);
      padding: 0 0.5rem;
    }

    .cc-stack-total .cc-stack-name {
      color: var(--foam);
    }

    .cc-stack-price {
      color: var(--caramel);
      font-family: 'Playfair Display', serif;
      font-size: 0.88rem;
    }

    .cc-order-btn { width: 100%; justify-content: center; }

    /* ── Toast de confirmación ──────────────────────── */
    .cc-order-toast {
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      background: var(--espresso);
      color: var(--foam);
      padding: 0.85rem 1.75rem;
      border-radius: 2rem;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      opacity: 0;
      transition: all 0.35s ease;
      z-index: 9999;
      border: 1px solid rgba(200, 137, 74, 0.4);
      box-shadow: 0 8px 32px rgba(44, 26, 14, 0.3);
    }

    .cc-order-toast.show {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }

    /* ── Nav link ───────────────────────────────────── */
    .nav-link-customize a {
      color: var(--caramel) !important;
    }

    /* ── Responsive ─────────────────────────────────── */
    @media (max-width: 700px) {
      .cc-layout {
        grid-template-columns: 1fr;
      }
      .cc-preview {
        position: static;
      }
      .cc-base-grid {
        grid-template-columns: 1fr;
      }
    }
  `;
  document.head.appendChild(style);
}

// ── Agrega "Customize" al nav ────────────────────────────────
function addNavLink() {
  const navLinks = document.querySelector('.nav-links');
  if (!navLinks) return;
  const li = document.createElement('li');
  li.className = 'nav-link-customize';
  li.innerHTML = '<a href="#customize">Customize</a>';
  navLinks.appendChild(li);
}

// ── Init ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  injectStyles();
  addNavLink();
  initCoffeeCustomizer();
});

// --- IMPLEMENTACIÓN DEL PATRÓN FÁBRICA (MAESTRO AHHMED) ---

function realizarPedidoFactory(tipoId) {
  console.log(`Conectando con la fábrica de Chopper Coffee para: ${tipoId}`);

  fetch(`http://127.0.0.1:5000/pedir/${tipoId}`)
    .then(response => {
      if (!response.ok) throw new Error('Servidor de Fábrica no responde');
      return response.json();
    })
    .then(data => {
      if (data.status === "success") {
        lanzarNotificacionFactory(data.mensaje);
      }
    })
    .catch(err => {
      console.error("Error de conexión:", err);
      alert("Asegúrese de que el Barista de Python (loot.py) esté corriendo en el puerto 5000.");
    });
}

function lanzarNotificacionFactory(mensaje) {
  const toast = document.createElement('div');
  toast.className = 'cc-order-toast';
  toast.innerHTML = `
        <span>☕</span>
        <span>${mensaje} — <small>Atendido por Chofia Paniels</small></span>
    `;
  document.body.appendChild(toast);

  // Animación de entrada y salida
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 4500);
}

