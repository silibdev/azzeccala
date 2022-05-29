import heartSvg from './heart-solid.svg';
import packageJson from '../../package.json';

const heartStyle = {
  width: '1.1rem',
  display: 'inline-block',
  marginBottom: '0.4rem',
  marginLeft: '0.25rem',
  marginRight: '0.25rem'
};

export const Footer = () => (
  <footer>
    <div className="feedback">
      <a className="btn" href="https://forms.gle/cYjHqQMw3pm68Dzu7" target="_blank" rel="noreferrer">Invia feedback</a>
    </div>
    <div className="footer">
      <div>Made with
        <img src={heartSvg} alt="cuore" style={heartStyle}/>
        by <a className="dev-link" href="https://github.com/silibdev" target="_blank" rel="noreferrer">Fabio
          Siliberto</a>
      </div>
      <div className="version">
        <span className="text-sm">Version</span>
        <span className="ml-1">{packageJson.version}</span>
      </div>
    </div>
  </footer>
)
