import { useSession, signIn, signOut } from "next-auth/react"

export default function Component() {
    const { data: session } = useSession()
    if (session) {
        return (
            <>
                Signed in as {session.user.email} <br />
                <button onClick={() => {
                    localStorage.clear();
                    const cookies = document.cookie.split("; ");
                    for (let c of cookies) {
                        const d = window.location.hostname.split(".");
                        while (d.length > 0) {
                            const cookieBase = encodeURIComponent(c.split(";")[0].split("=")[0]) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=" + d.join('.') + " ;path=";
                            const paths = location.pathname.split('/');
                            document.cookie = cookieBase + '/';
                            for (let i = 0; i < paths.length; i++) {
                                document.cookie = cookieBase + paths.slice(0, i + 1).join('/');
                            }
                            d.shift();
                        }
                    }
                    signOut()
                }
                }>Sign out</button>
            </>
        )
    }
    return (
        <>
            Not signed in <br />
            <button onClick={() => signIn()}>Sign in</button>
        </>
    )
}