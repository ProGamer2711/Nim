var heapArray;

function startGame() {
	heapArray = new HeapArray(4);
	heapArray.createElements();
	heapArray.awaitMove();
}

class HeapArray {
	constructor(length) {
		this.length = length;

		this.turn = confirm("Do you want to go first?") ? "You" : "AI";

		let heapLength = 1;
		for (let i = 0; i < length; i++) {
			this[i] = heapLength;
			heapLength += 2;
		}
	}

	createElements() {
		let heaps = this.toArray();

		$("body").html(`<div id="heaps-container"></div>`);

		heaps.forEach((heap, i) => {
			$(`#heaps-container`).append(
				`<div id="heap-${i}" class="heap">${heap} <button onclick="heapArray.playerMakeMove(${i});">Remove</button></div>`
			);
		});

		$("#heaps-container").append(
			`<button id="ai-turn-button" onclick="heapArray.switchTurn();">AI Turn</button>`
		);
	}

	updateElements() {
		let heaps = this.toArray();

		heaps.forEach((heap, i) => {
			$(`#heap-${i}`).html(
				`${heap} <button onclick="heapArray.playerMakeMove(${i});">Remove</button>`
			);
		});
	}

	toArray() {
		let heaps = [];
		for (let i = 0; i < this.length; i++) {
			heaps.push(this[i]);
		}

		return heaps;
	}

	calculateHeapSums() {
		return this.toArray().reduce((a, b) => a + b);
	}

	maxHeapIndex() {
		return this.toArray().indexOf(
			this.toArray().reduce((a, b) => Math.max(a, b))
		);
	}

	calculateNimSum() {
		return this.toArray().reduce((a, b) => a ^ b);
	}

	aiCalculateMove() {
		if (this.calculateHeapSums() === 1)
			return {
				index: this.maxHeapIndex(),
				amount: 1,
			};

		let heaps = this.toArray();

		let largeHeaps = 0;
		for (let i = 0; i < heaps.length; i++) {
			if (heaps[i] > 1) {
				largeHeaps++;
			}
		}

		if (largeHeaps <= 1) {
			let numberOfHeaps = heaps
				.map((heap) => heap > 0)
				.filter((val) => val).length;

			let maxHeapIndex = this.maxHeapIndex();

			return {
				index: maxHeapIndex,
				amount: heaps[maxHeapIndex] - (numberOfHeaps % 2),
			};
		}

		let heapSums = heaps.map((heap) => heap ^ this.calculateNimSum());

		for (let i = 0; i < heapSums.length; i++) {
			if (heapSums[i] < heaps[i]) {
				return { index: i, amount: heaps[i] - heapSums[i] };
			}
		}

		return {
			index: this.maxHeapIndex(),
			amount: 1,
		};
	}

	aiMakeMove() {
		let move = this.aiCalculateMove();
		this[move.index] -= move.amount;

		this.updateElements();
	}

	playerMakeMove(index) {
		if (this.turn !== "You") return alert("It's not your turn!");

		if (
			(this.playerHeap === undefined ||
				this.playerHeap === null ||
				this.playerHeap === index) &&
			this[index] > 0
		) {
			this.playerHeap = index;
			this.moved = true;
			this[index]--;
			this.winCheck("AI");
		}

		this.updateElements();
	}

	awaitMove() {
		if (this.turn === "AI") {
			setTimeout(() => {
				this.aiMakeMove();
				this.switchTurn();
				this.winCheck("You");
			}, 1000);
		}
	}

	switchTurn() {
		if (this.moved || this.turn === "AI") {
			this.turn = this.turn === "You" ? "AI" : "You";

			this.playerHeap = null;
			this.moved = false;

			this.awaitMove();
		} else {
			alert("You must make a move!");
		}
	}

	winCheck(player) {
		if (this.calculateHeapSums() === 0) {
			alert(`${player} won!`);

			for (let i = 0; i < this.length; i++) {
				this[i] = null;
			}

			this.length = null;
			this.turn = null;
			this.playerHeap = null;

			HeapArray.gameOver();
		}
	}

	static gameOver() {
		$("body").html(
			`
			<p>
				In the game of Nim you have heaps of items (normally sticks; in this case
				just numbers [for now])
				which you and an AI take from. You can choose any heap and you can take
				any number of items from only that heap.
				The goal is to leave your opponent with one item to take. In this case you
				win.
			</p>
			<button id='start-button' onclick='startGame()'>Start</button>
			<p id="credit">First beaten with proof by KingOfDeath__</p>
			`
		);
	}
}

HeapArray.gameOver();
