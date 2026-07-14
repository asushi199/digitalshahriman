import { SYSTEM_CATEGORIES } from '../lib/systems'

const categories = SYSTEM_CATEGORIES.filter((category) => category !== 'Semua')

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__identity">
          <div className="site-footer__crest">
            <span aria-hidden="true">SMKRS</span>
            <img
              alt="Lencana SMK Raja Shahriman"
              src="/brand/smkrs-crest.jpg"
              onError={(event) => {
                event.currentTarget.hidden = true
              }}
            />
          </div>
          <div>
            <p>Portal Digital</p>
            <strong>SMK Raja Shahriman</strong>
            <span>Pengetahuan Punca Kejayaan</span>
          </div>
        </div>

        <div className="site-footer__categories">
          <p>Kategori eSistem</p>
          <ul>
            {categories.map((category) => (
              <li key={category}>{category}</li>
            ))}
          </ul>
        </div>

        <div className="site-footer__notice">
          <p>Makluman pautan luar</p>
          <strong>
            eSistem yang dipautkan beroperasi di destinasi masing-masing.
          </strong>
          <span>
            Setiap pautan dibuka dalam tab baharu supaya portal ini kekal
            tersedia.
          </span>
        </div>
      </div>
      <div className="site-footer__base">
        <span>Portal rasmi sekolah</span>
        <span>SMK Raja Shahriman</span>
      </div>
    </footer>
  )
}
