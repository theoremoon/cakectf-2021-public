import Flag from "react-world-flags";

type CountryFlagProps = {
    code: string;
} & React.ComponentPropsWithoutRef<'img'>;


const CountryFlag = ({code, ...props}: CountryFlagProps) => {
    return <Flag code={code} {...props} style={{height: '0.75em'}} />
}

export default CountryFlag;