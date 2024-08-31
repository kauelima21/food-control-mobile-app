import { Link, LinkProps } from 'expo-router';

type ButtonLinkProps = LinkProps<string> & {
  title: string;
};

export function LinkButton({ title, ...rest }: ButtonLinkProps) {
  return (
    <Link className="text-slate-300 text-center text-base font-body" {...rest}>
      {title}
    </Link>
  );
}
