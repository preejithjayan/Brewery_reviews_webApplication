import StarFillIcon from "./StarFillIcon";
import StarIcon from "./StarIcon";

export default function Rating({value, setValue, size}) {
    return (
        <>
            {new Array(5).fill(1).map((_,ii) => (
                <span onClick={() => setValue && setValue(ii+1)} key={ii}>
                    {value>ii?<StarFillIcon size={size} />:<StarIcon size={size} />}
                </span>
            ))}
        </>
    )
}