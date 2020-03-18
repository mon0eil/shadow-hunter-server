interface ColorDice {
    x: number;
    y: number;
    color: string;
    id: number;
}

export class Game {
    connections = [];
    colorDices: ColorDice[] = [];

    addPlayer(connection) {

        this.connections.push(connection);

        connection.on('message', message => {
            const json = JSON.parse(message);
            this.handleMessage(connection, json.type, json.data);
        });

        connection.on('close', () => {
            this.connections.splice(this.connections.findIndex(c => c === connection), 1);
            this.broadcastConnectedPlayerCount();
        })

        this.broadcastConnectedPlayerCount();
        this.broadcastColorDices();
    }

    reset() {
        this.colorDices = [];
        this.broadcastColorDices();
        this.broadcastConnectedPlayerCount();
    }

    handleMessage(connection, type, data) {
        switch(type) {
            case 'create':
                this.addDices(data);
                break;
            case 'move':
                this.moveDice(data.id, data.x, data.y);
                break;
            case 'reset':
                this.reset();
            default:
                connection.send(JSON.stringify({ type: 'error', data: 'No handler for action type : ' + type }));
                break;
        }
    }

    addDices(color: string) {
        if (!this.colorDices.find(dice => dice.color === color)) {
            this.colorDices.push(
                {
                    x: 10,
                    y: 20,
                    color,
                    id: Math.random()
                },
                {
                    x: 20,
                    y: 30,
                    color,
                    id: Math.random()
                },
            );
        }
        this.broadcastColorDices();
    }

    moveDice(id: number, x: number, y: number) {
        const colorDice = this.colorDices.find(cd => cd.id === id);
        if (!colorDice) return; 

        colorDice.x = x;
        colorDice.y = y;

        this.broadcastColorDices();
    }

    broadcast(type: string, data: any) {
        return this.connections.forEach(connection => {
            connection.send(JSON.stringify({ type, data }));
        });
    }

    broadcastColorDices() {
        this.broadcast('colorDices', this.colorDices);
    }

    broadcastConnectedPlayerCount() {
        this.broadcast('playerCount', this.connections.length);
    }
}