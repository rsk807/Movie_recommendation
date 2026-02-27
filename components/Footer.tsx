interface FooterProps {
    onShowInfo: (type: 'help' | 'privacy') => void;
}

export default function Footer({ onShowInfo }: FooterProps) {
    return (
        <footer className="w-full py-12 border-t mt-20 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-center md:text-left">
                        <h3 className="text-lg font-bold mb-2 uppercase tracking-tighter italic">Cine<span className="text-primary italic">Match</span></h3>
                        <p className="text-sm text-muted-foreground max-w-xs">
                            Personalized movie recommendations powered by TMDB metadata and curated mood filtering.
                        </p>
                    </div>

                    <div className="flex gap-8 text-sm font-medium text-muted-foreground">
                        <button onClick={() => onShowInfo('privacy')} className="hover:text-primary transition-colors cursor-pointer bg-transparent border-none p-0 outline-none">Privacy & Rights</button>
                        <a href="https://www.themoviedb.org/" target="_blank" className="hover:text-primary transition-colors">TMDB Official</a>
                        <button onClick={() => onShowInfo('help')} className="hover:text-primary transition-colors cursor-pointer bg-transparent border-none p-0 outline-none">Help</button>
                    </div>
                </div>

                <div className="mt-12 flex flex-col items-center gap-4 border-t pt-8">
                    <p className="text-xs text-muted-foreground">
                        &copy; {new Date().getFullYear()} CineMatch App. Made for movie lovers.
                    </p>
                    <div className="flex items-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-300">
                        <img
                            src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
                            alt="TMDB Logo"
                            className="h-4"
                        />
                    </div>
                    <p className="text-[10px] text-muted-foreground text-center max-w-md">
                        All movie data and images are provided by The Movie Database (TMDB). This product uses the TMDB API but is not endorsed or certified by TMDB.
                    </p>
                </div>
            </div>
        </footer>
    );
}
