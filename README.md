# Rover Calendar
ローバー向けのイベントを集約するカレンダー
## 使い方
[使い方](https://hackmd.io/@msy14/rover-calendar)
## ドキュメント
[ドキュメント](https://hackmd.io/@msy14/rover-calendar/%2Fg_lZKPjpSKSJVyY_ANF_Fw)
## スクリーンショット 🖼️
![Screenshot 2024-05-06 at 18 29 54](https://github.com/fox-Nh133/rover-calendar/assets/106661910/42b9a563-0f04-4452-bf2d-8e7de7652cb0)
## 実装イメージ
```mermaid
graph LR
    subgraph frontend
        subgraph freamworks
           css(Bulma CSS)
           js1(FullCalendar JS)
           js2(iCAL JS)
        end
    end
    subgraph backend
        gh-page(GitHub Pages)
        subgraph GitHub Actions
            fetch(fetch-calendar.yml)
            deploy(pages-build-deployment) 
        end
    end
    subgraph external
        iCalResource(Google Calendar ical URL)
    end

    gh-page <--> frontend
    iCalResource <--update event data every 3 hour--> fetch
    fetch --> deploy
    deploy --deploy--> gh-page
```
## ライセンス
[MIT License](https://github.com/fox-Nh133/rover-calendar/blob/main/LICENSE.md)
