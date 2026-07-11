


function PageHeader({children, title, subtitle}) {
    const headerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    };


    return (
        <section className="page-header" style={headerStyle}>
            <div>
                <h1>{title}</h1>  
                <p>{subtitle}</p>
            </div>
            {children}
        </section>
    );
}

export default PageHeader;
