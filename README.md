# Women Rise Initiatives website

## Run
    npm install
    npm start          # http://localhost:3000
Admin: http://localhost:3000/admin.html  (default admin / ChangeMe123)
Set your own: ADMIN_USER=... ADMIN_PASS=... npm start

## Update pictures and activities
Put photos in public/images/{hero,ongoing,planned,implemented,partners}/ then
edit public/data/content.json (title, location, image path, partners/donors).
Missing images fall back to a colored panel automatically.
Hero photo: public/images/hero/hero.jpg

## Data
Contact messages and newsletter subscribers are stored in data.db (SQLite), created on first run.

## Program pictures
The six "What we do" pictures live in public/images/programs/ (nutrition-health, education-skill-development,
youth-empowerment, safeguarding, livelihood, peace-building). To change one, replace the file with the same name
(or edit the <img> path in public/index.html).

## Program detail pages
Clicking a card under "What we do" opens program.html?p=<name>. All text is in public/data/programs.json
(headline, intro, closing line, four activities). Activity pictures go in public/images/programs/<program>/
using the file names listed in that JSON (e.g. images/programs/health-nutrition/wash.jpg). Missing pictures
show a coloured panel until you add them. To add an activity, copy one block in the JSON.

## Publishing it online (so the public can view it)

The site has two parts, and free hosts treat them differently:

- **The pages** (everything in `public/`: HTML, CSS, pictures) can be hosted for free almost anywhere.
- **The server** (`server.js` with SQLite) powers the contact form, newsletter signup and admin inbox.
  GitHub Pages and Netlify cannot run it, so on those two the pages show but the forms and admin login do not work.

| Option | Cost | Pages visible | Contact form, newsletter, admin |
|---|---|---|---|
| GitHub Pages | Free (public repository) | Yes | No, static pages only |
| Netlify | Free plan (monthly usage allowance; the site pauses if it is used up) | Yes | No, static pages only |
| Render | Free instance available | Yes | Yes, but see the warning below |
| Hostinger | Paid, no free plan | Yes | Yes, on plans that support Node.js apps |

Plans and limits change, so check each provider's pricing page before you commit.

### Before publishing anything
1. Replace the sample text: phone numbers, emails, social links, partners, donors, district names and activities.
2. Add your real pictures (see the picture sections above) and keep them reasonably small (under about 500 KB each) so pages load fast.
3. Never put the admin password in the code. Set `ADMIN_USER` and `ADMIN_PASS` as environment variables on the host.
4. The `.gitignore` file keeps `data.db` (visitor messages and subscriber emails) and `node_modules/` out of GitHub. Keep it that way, because a public repository is visible to everyone.

### 1. GitHub (code storage) and GitHub Pages (free site, pages only)
1. Create a free account at github.com and a new **public** repository, for example `women-rise-initiatives`.
2. In this project folder run:
       git init
       git add .
       git commit -m "First version"
       git branch -M main
       git remote add origin https://github.com/YOUR-USERNAME/women-rise-initiatives.git
       git push -u origin main
   (No Git? On the repository page choose "Add file" then "Upload files" and drag the project in. Include the hidden `.github` folder.)
3. On GitHub open **Settings, Pages** and set **Source** to **GitHub Actions**.
4. The included workflow (`.github/workflows/pages.yml`) publishes the `public/` folder. After a minute your site is at
   `https://YOUR-USERNAME.github.io/women-rise-initiatives/`. Every push to `main` updates it.

### 2. Netlify (free site, pages only)
- Quickest: sign in at netlify.com, choose **Add new site, Deploy manually** and drag the **`public`** folder onto the page.
- Or: **Add new site, Import an existing project**, pick your GitHub repository. The included `netlify.toml` already sets the publish folder to `public`, so leave the build command empty.
- You get a free `something.netlify.app` address, and you can connect your own domain later.

### 3. Render (free, runs the whole site including forms and admin)
1. Push the project to GitHub (step 1 above).
2. At render.com choose **New, Web Service**, connect the repository and use:
   Build command `npm install`, Start command `npm start`, Instance type **Free**.
3. Under **Environment** add `ADMIN_USER`, `ADMIN_PASS` (a strong password) and `NODE_VERSION` = `22`.
4. Deploy. Your site opens at `https://your-service-name.onrender.com` and the admin page at `/admin.html`.

**Warnings for the free Render plan:**
- It goes to sleep after about 15 minutes with no visitors, so the first visit afterwards can take up to a minute to load.
- Files written to disk, including `data.db`, can be lost when the service restarts or is redeployed unless you add a paid persistent disk. Treat it as a demo, and copy messages and subscribers out of the admin page regularly.

### 4. Hostinger (paid, the best fit for the real, permanent site)
Hostinger has no free plan. Its Business web hosting, cloud hosting and Web Apps hosting plans can run Node.js apps.
1. Buy a plan that supports Node.js apps, then in hPanel add a **Node.js web app**.
2. Import the project from GitHub or upload it as a ZIP, with start command `npm start` (menu names change, so follow the on-screen steps).
3. Add `ADMIN_USER` and `ADMIN_PASS` as environment variables, and connect your domain.
4. Because the files stay on your hosting space, `data.db` is kept between restarts. Still download a backup copy regularly.

### Which should I choose?
- **Just want the public to see the site for free:** GitHub Pages or Netlify.
- **Want to show the working contact form and admin for free (demo):** Render.
- **Real organization site that collects real messages:** a paid Node.js host such as Hostinger.

### Known limit
The forms call `/api/...` on the same address as the pages. To keep the pages on GitHub Pages or Netlify and run only the server elsewhere, the forms need a small change to point at the server's address (and the server needs to allow requests from the site). Ask for this if you want that setup.

## Partners and donors
Names, logos and website links are in public/data/content.json (the "partners" list; "type" is "partner" or "donor").
The names and logos that come with the site are made up, and every link points to https://example.com until you change it.
Partner logos live in public/images/partners/ and donor logos in public/images/donors/. To change one, drop in the real
logo (SVG, PNG or JPG, ideally square or wide on a transparent background) and update its "logo" and "url" lines in the JSON.
Logos show in grey, turn to full colour and grow when hovered, and open the website in a new browser tab.
