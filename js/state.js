/**
 * OrderCraft State Store
 * Centralized, reactive state store with event notification.
 */
window.OrderCraft = window.OrderCraft || {};

window.OrderCraft.state = (() => {
    const _state = {
        activePage: "dashboardPage",
        orders: [],
        materials: [],
        purchaseOrders: [],
        currentOrder: null,
        bomMaterials: [],
        loading: false
    };

    const _listeners = new Map();

    return {
        get(key) {
            return _state[key];
        },

        set(key, value) {
            const oldValue = _state[key];
            _state[key] = value;
            this.emit(key, value, oldValue);
            this.emit("change", { key, value, oldValue });
        },

        update(key, fn) {
            const oldValue = _state[key];
            const newValue = fn(oldValue);
            this.set(key, newValue);
        },

        subscribe(key, callback) {
            if (!_listeners.has(key)) {
                _listeners.set(key, new Set());
            }
            _listeners.get(key).add(callback);

            // Return unsubscribe function
            return () => {
                _listeners.get(key)?.delete(callback);
            };
        },

        emit(key, data, extra) {
            if (_listeners.has(key)) {
                _listeners.get(key).forEach((cb) => {
                    try {
                        cb(data, extra);
                    } catch (e) {
                        console.error(`Error in state listener for "${key}":`, e);
                    }
                });
            }
        },

        getAll() {
            return { ..._state };
        }
    };
})();
