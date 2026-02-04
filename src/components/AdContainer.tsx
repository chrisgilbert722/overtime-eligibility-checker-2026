interface AdContainerProps { slot: string; format: string; sticky?: boolean; }
export default function AdContainer({ slot, format, sticky }: AdContainerProps) {
    return <div className={`ad-container${sticky ? ' sticky' : ''}`}><p>Ad Placement: {slot} ({format})</p></div>;
}
