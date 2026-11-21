export default function FieldError({ messages }: { messages?: string[] }) {
    if (!messages?.length) return null
    return (
        <>
            {messages.map(msg => (
                <p key={msg} className="text-red-400 text-xs mt-1">
                    {msg}
                </p>
            ))}
        </>
    )
}