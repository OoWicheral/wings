

export default function ChatIA() {

    return (
        <div className="body-chat">
            <div>
                <aside>
                    <div>
                        <a href="/">
                            <img src="/logo.svg" alt="Logo da Marca" />
                        </a>

                        <div>
                            <button className="btn-aside">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="size-5"><path d="M9.33301 20L9.33301 4M18.5 4L5.5 4C4.67157 4 4 4.67157 4 5.5L4 18.5C4 19.3284 4.67157 20 5.5 20L18.5 20C19.3284 20 20 19.3284 20 18.5L20 5.5C20 4.67157 19.3284 4 18.5 4Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                            </button>

                            
                        </div>

                    

                    </div>

                    <div>
                        <button className="btn-aside">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="size-5"><path d="M18.8755 13.6249V19.6249C18.8755 20.4533 18.2039 21.1249 17.3755 21.1249H4.37488C3.54639 21.1249 2.87479 20.4532 2.87488 19.6247L2.8756 13.1249L2.94432 6.60903C2.95299 5.78682 3.62185 5.12485 4.44411 5.12485H10.3756M16.4799 5.16165L19.044 7.72574M19.6744 3.31449L20.6858 4.32585C21.2716 4.91163 21.2716 5.86138 20.6858 6.44717L12.2618 14.8711C12.0562 15.0767 11.7953 15.2181 11.5108 15.2781L7.9766 16.0237L8.72213 12.4895C8.78214 12.205 8.92356 11.944 9.12917 11.7384L17.5531 3.31449C18.1389 2.72871 19.0886 2.72871 19.6744 3.31449Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                            Nova Conversa
                        </button>

                        <button className="btn-aside">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="size-5"><path d="M18.8755 13.6249V19.6249C18.8755 20.4533 18.2039 21.1249 17.3755 21.1249H4.37488C3.54639 21.1249 2.87479 20.4532 2.87488 19.6247L2.8756 13.1249L2.94432 6.60903C2.95299 5.78682 3.62185 5.12485 4.44411 5.12485H10.3756M16.4799 5.16165L19.044 7.72574M19.6744 3.31449L20.6858 4.32585C21.2716 4.91163 21.2716 5.86138 20.6858 6.44717L12.2618 14.8711C12.0562 15.0767 11.7953 15.2181 11.5108 15.2781L7.9766 16.0237L8.72213 12.4895C8.78214 12.205 8.92356 11.944 9.12917 11.7384L17.5531 3.31449C18.1389 2.72871 19.0886 2.72871 19.6744 3.31449Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                            Home
                        </button>

                        <button className="btn-aside">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="size-5"><path d="M18.8755 13.6249V19.6249C18.8755 20.4533 18.2039 21.1249 17.3755 21.1249H4.37488C3.54639 21.1249 2.87479 20.4532 2.87488 19.6247L2.8756 13.1249L2.94432 6.60903C2.95299 5.78682 3.62185 5.12485 4.44411 5.12485H10.3756M16.4799 5.16165L19.044 7.72574M19.6744 3.31449L20.6858 4.32585C21.2716 4.91163 21.2716 5.86138 20.6858 6.44717L12.2618 14.8711C12.0562 15.0767 11.7953 15.2181 11.5108 15.2781L7.9766 16.0237L8.72213 12.4895C8.78214 12.205 8.92356 11.944 9.12917 11.7384L17.5531 3.31449C18.1389 2.72871 19.0886 2.72871 19.6744 3.31449Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                            Nova Conversa
                        </button>

                        <button className="btn-aside">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="size-5"><path d="M18.8755 13.6249V19.6249C18.8755 20.4533 18.2039 21.1249 17.3755 21.1249H4.37488C3.54639 21.1249 2.87479 20.4532 2.87488 19.6247L2.8756 13.1249L2.94432 6.60903C2.95299 5.78682 3.62185 5.12485 4.44411 5.12485H10.3756M16.4799 5.16165L19.044 7.72574M19.6744 3.31449L20.6858 4.32585C21.2716 4.91163 21.2716 5.86138 20.6858 6.44717L12.2618 14.8711C12.0562 15.0767 11.7953 15.2181 11.5108 15.2781L7.9766 16.0237L8.72213 12.4895C8.78214 12.205 8.92356 11.944 9.12917 11.7384L17.5531 3.31449C18.1389 2.72871 19.0886 2.72871 19.6744 3.31449Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                            Nova Conversa
                        </button>

                        <button className="btn-aside">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="size-5"><path d="M18.8755 13.6249V19.6249C18.8755 20.4533 18.2039 21.1249 17.3755 21.1249H4.37488C3.54639 21.1249 2.87479 20.4532 2.87488 19.6247L2.8756 13.1249L2.94432 6.60903C2.95299 5.78682 3.62185 5.12485 4.44411 5.12485H10.3756M16.4799 5.16165L19.044 7.72574M19.6744 3.31449L20.6858 4.32585C21.2716 4.91163 21.2716 5.86138 20.6858 6.44717L12.2618 14.8711C12.0562 15.0767 11.7953 15.2181 11.5108 15.2781L7.9766 16.0237L8.72213 12.4895C8.78214 12.205 8.92356 11.944 9.12917 11.7384L17.5531 3.31449C18.1389 2.72871 19.0886 2.72871 19.6744 3.31449Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                            Nova Conversa
                        </button>

                        
                    </div>
                </aside>

                <div>
                    <main>
                        <div>

                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}