import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";

export default function Home() {
	const [name, setName] = useState<string>("");
	const [ws, setWs] = useState<WebSocket | null>(null);
	const [messages, setMessages] = useState<string[]>([]);
	const messageRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const username = prompt("Please enter your name: ") ?? "No name";
		setName(username);

		const websocket = new WebSocket(
			`ws://localhost:8080/ws?username=${username}`,
		);
		setWs(websocket);

		websocket.onopen = () => {
			addMessage("<b>me</b>: connected.");
		};

		websocket.onmessage = (e) => {
			const res = JSON.parse(e?.data);

			let message: string;
			if (res?.Type === "New User") {
				message = `User <b>${res?.From}</b> connected.`;
			} else if (res?.Type === "Leave") {
				message = `User <b>${res?.From}</b> disconnected.`;
			} else {
				message = `<b>${res?.From}</b>: ${res?.Message}`;
			}

			addMessage(message);
		};

		websocket.onclose = () => {
			addMessage("<b>me</b>: disconnected.");
		};

		return () => {
			websocket.close();
		};
	}, []);

	const addMessage = (message: string) => {
		setMessages((prevMsg) => [...prevMsg, message]);
	};

	const handleSendMessage = (e: React.FormEvent) => {
		e.preventDefault();
		if (!ws) return;

		const messageRaw = messageRef.current?.value ?? "";
		ws.send(JSON.stringify({ Message: messageRaw }));

		const message: string = `<b>me</b>: ${messageRaw}`;
		addMessage(message);

		if (messageRef.current) {
			messageRef.current.value = "";
		}
	};

	return (
		<div className="w-full h-screen bg-neutral-100 flex justify-center items-center">
			<div className="w-[460px] h-5/6 bg-white shadow-md rounded-xl flex flex-col items-center">
				<div id="container" className="w-full h-full p-4">
					{messages.map((msg, idx) => (
						<p
							className="w-full h-auto break-all text-pretty text-sm text-left text-neutral-800 font-normal hyphens-auto"
							key={idx}
							dangerouslySetInnerHTML={{ __html: msg }}
						/>
					))}
				</div>

				<div className="w-full p-4">
					<form onSubmit={handleSendMessage}>
						<div className="relative w-full flex gap-4 items-center bg-white rounded-lg border border-neutral-300 shadow-md p-2">
							<input
								type="text"
								placeholder="Your message"
								ref={messageRef}
								className="w-full h-full bg-inherit border border-neutral-400 outline-0 outline-none p-2 rounded-md duration-200 ease-out focus:border-neutral-600 font-normal text-neutral-800 placeholder:text-neutral-200 placeholder:font-light"
							/>
							<button
								type="submit"
								className="w-6 h-6 flex justify-center items-center text-neutral-800 text-lg"
							>
								<Icon icon="carbon:send-filled" />
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
