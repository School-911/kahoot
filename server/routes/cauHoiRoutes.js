router.post('/', taoCauHoi)

router.get('/', layTatCaCauHoi)

router.put('/:id', capNhatCauHoi)

router.delete('/:id', xoaCauHoi)

router.get('/ngau-nhien', layCauHoiNgauNhien)

router.get('/:id', layCauHoiTheoId)

export default router
